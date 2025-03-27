"use client";

import { useState, useEffect } from "react";
import { Brain, Mic, Play, Download, ChevronRight, Upload, Table, Target, Variable, FileText, Database, BarChart2, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Papa from 'papaparse';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { KnowledgeGraph } from "./components/knowledge-graph";
import { ModelArchitecture } from "./components/model-architecture";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface DataStats {
  totalRows: number;
  totalColumns: number;
  missingValues: number;
  dataTypes: { [key: string]: string };
  uniqueValues: { [key: string]: number };
}

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelId, setModelId] = useState<string | null>(null);
  const [knowledgeGraph, setKnowledgeGraph] = useState(null);
  const [architecture, setArchitecture] = useState(null);
  const [activeTab, setActiveTab] = useState("data");
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [dataPreview, setDataPreview] = useState<any[]>([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [embeddingConfig, setEmbeddingConfig] = useState({
    method: "bert",
    dimension: 768
  });
  const [dataStats, setDataStats] = useState<DataStats>({
    totalRows: 0,
    totalColumns: 0,
    missingValues: 0,
    dataTypes: {},
    uniqueValues: {}
  });

  const detectDataType = (values: any[]): string => {
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    if (nonNullValues.length === 0) return 'unknown';

    const sample = nonNullValues[0];
    if (!isNaN(Date.parse(sample))) return 'datetime';
    if (!isNaN(sample) && sample.toString().includes('.')) return 'float';
    if (!isNaN(sample)) return 'integer';
    if (typeof sample === 'boolean') return 'boolean';
    if (nonNullValues.every(v => ['true', 'false'].includes(v.toLowerCase()))) return 'boolean';
    
    const uniqueValues = new Set(nonNullValues);
    if (uniqueValues.size <= 10 && uniqueValues.size < nonNullValues.length / 2) return 'categorical';
    
    return 'string';
  };

  const calculateDataStats = (data: any[]): DataStats => {
    if (!data.length) return {
      totalRows: 0,
      totalColumns: 0,
      missingValues: 0,
      dataTypes: {},
      uniqueValues: {}
    };

    const columns = Object.keys(data[0]);
    const stats: DataStats = {
      totalRows: data.length,
      totalColumns: columns.length,
      missingValues: 0,
      dataTypes: {},
      uniqueValues: {}
    };

    columns.forEach(column => {
      const values = data.map(row => row[column]);
      const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
      
      stats.missingValues += values.length - nonNullValues.length;
      stats.dataTypes[column] = detectDataType(values);
      stats.uniqueValues[column] = new Set(values).size;
    });

    return stats;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDataFile(file);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') return;

      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const data = results.data as any[];
          
          // Remove last row if empty
          if (Object.values(data[data.length - 1]).every(v => !v)) {
            data.pop();
          }

          // Set preview data (first 10 rows)
          setDataPreview(data.slice(0, 10));
          
          // Calculate and set statistics
          const stats = calculateDataStats(data);
          setDataStats(stats);
          
          setShowDataPreview(true);
          setCurrentStep(1);
        },
        error: (error) => {
          console.error('Error parsing file:', error);
          // TODO: Show error toast
        }
      });
    };
    
    reader.readAsText(file);
  };

  const steps = [
    { icon: "📁", title: "Upload Data", description: "Upload your dataset" },
    { icon: "🎯", title: "Select Variables", description: "Choose target and features" },
    { icon: "🔍", title: "Configure Embeddings", description: "Set embedding parameters" },
    { icon: "🏗️", title: "Build Model", description: "Configure architecture" },
    { icon: "🧠", title: "Train Model", description: "Start training process" },
    { icon: "📊", title: "Evaluate", description: "View results and metrics" },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTargetSelection = (value: string) => {
    setSelectedTarget(value);
    setCurrentStep(2);
  };

  const handleFeatureSelection = (value: string) => {
    setSelectedFeatures(prev => 
      prev.includes(value) 
        ? prev.filter(f => f !== value)
        : [...prev, value]
    );
  };

  const handleEmbeddingConfig = (method: string) => {
    setEmbeddingConfig(prev => ({ ...prev, method }));
    setCurrentStep(3);
  };

  const startTraining = async () => {
    setShowConfirmation(false);
    setIsProcessing(true);
    setCurrentStep(4);
    
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          config: {
            target: selectedTarget,
            features: selectedFeatures,
            embedding: embeddingConfig
          }
        })
      });
      
      const data = await response.json();
      setModelId(data.id);
    } catch (error) {
      console.error("Error starting training:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center space-x-2 mb-8">
        <Brain className="h-6 w-6" />
        <h1 className="text-2xl font-bold">AI Model Builder</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="embeddings">Embeddings</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Your Dataset</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept=".csv,.json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your file here, or click to select
                  </p>
                </Label>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select Variables</h2>
            <div className="space-y-6">
              <div>
                <Label>Target Variable</Label>
                <Select onValueChange={handleTargetSelection} value={selectedTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target variable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="label">Label</SelectItem>
                    <SelectItem value="sentiment">Sentiment</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Feature Variables</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["text", "metadata", "timestamp", "user_id"].map((feature) => (
                    <Button
                      key={feature}
                      variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                      onClick={() => handleFeatureSelection(feature)}
                      className="justify-start"
                    >
                      <Variable className="h-4 w-4 mr-2" />
                      {feature}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="embeddings" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Configure Embeddings</h2>
            <div className="space-y-6">
              <div>
                <Label>Embedding Method</Label>
                <Select 
                  onValueChange={(value) => handleEmbeddingConfig(value)}
                  value={embeddingConfig.method}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select embedding method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bert">BERT</SelectItem>
                    <SelectItem value="word2vec">Word2Vec</SelectItem>
                    <SelectItem value="fasttext">FastText</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Embedding Dimension</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dimension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128</SelectItem>
                    <SelectItem value="256">256</SelectItem>
                    <SelectItem value="512">512</SelectItem>
                    <SelectItem value="768">768</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          {architecture && <ModelArchitecture architecture={architecture} />}
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Training Progress</h2>
            {isProcessing && (
              <div className="space-y-4">
                <Progress value={trainingProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Training progress: {Math.round(trainingProgress)}%
                </p>
              </div>
            )}
            {!isProcessing && (
              <Button onClick={() => setShowConfirmation(true)}>
                Start Training
                <Play className="h-4 w-4 ml-2" />
              </Button>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {knowledgeGraph && <KnowledgeGraph data={knowledgeGraph} />}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Model Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-secondary">
                <h3 className="font-medium mb-2">Accuracy</h3>
                <p className="text-2xl font-bold">95.8%</p>
              </Card>
              <Card className="p-4 bg-secondary">
                <h3 className="font-medium mb-2">Precision</h3>
                <p className="text-2xl font-bold">94.2%</p>
              </Card>
              <Card className="p-4 bg-secondary">
                <h3 className="font-medium mb-2">Recall</h3>
                <p className="text-2xl font-bold">93.7%</p>
              </Card>
              <Card className="p-4 bg-secondary">
                <h3 className="font-medium mb-2">F1 Score</h3>
                <p className="text-2xl font-bold">93.9%</p>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Steps Progress */}
      <div className="grid gap-4 mt-8">
        {steps.map((step, index) => (
          <Card
            key={index}
            className={`p-4 transition-all duration-300 ${
              currentStep === index
                ? "border-primary shadow-lg"
                : currentStep > index
                ? "opacity-50"
                : ""
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{step.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {currentStep > index && (
                <div className="text-green-500">✓</div>
              )}
              {currentStep === index && (
                <div className="animate-pulse">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Data Preview Dialog */}
      <Dialog open={showDataPreview} onOpenChange={setShowDataPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dataset Preview
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileIcon className="h-5 w-5" />
                <h3 className="font-semibold">File Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {dataFile?.name}</p>
                <p><span className="text-muted-foreground">Size:</span> {dataFile && formatFileSize(dataFile.size)}</p>
                <p><span className="text-muted-foreground">Type:</span> {dataFile?.type || "text/csv"}</p>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5" />
                <h3 className="font-semibold">Dataset Statistics</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Total Rows:</span> {dataStats.totalRows.toLocaleString()}</p>
                <p><span className="text-muted-foreground">Total Columns:</span> {dataStats.totalColumns}</p>
                <p><span className="text-muted-foreground">Missing Values:</span> {dataStats.missingValues}</p>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="h-5 w-5" />
              <h3 className="font-semibold">Column Information</h3>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {Object.entries(dataStats.dataTypes).map(([column, type]) => (
                  <div key={column} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{column}</p>
                      <p className="text-sm text-muted-foreground">
                        {dataStats.uniqueValues[column] 
                          ? `${dataStats.uniqueValues[column]} unique values`
                          : ""}
                      </p>
                    </div>
                    <Badge variant="secondary">{type}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Table className="h-5 w-5" />
              <h3 className="font-semibold">Data Preview</h3>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="w-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(dataPreview[0] || {}).map((header) => (
                        <th key={header} className="text-left p-2 font-medium">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataPreview.map((row, idx) => (
                      <tr key={idx} className="border-b">
                        {Object.values(row).map((value: any, i) => (
                          <td key={i} className="p-2">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </Card>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDataPreview(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowDataPreview(false);
              setActiveTab("variables");
            }}>
              Continue to Variable Selection
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Model Training</DialogTitle>
            <DialogDescription>
              You're about to start training your model with the following configuration:
              <ul className="mt-2 space-y-1">
                <li>• Target Variable: {selectedTarget}</li>
                <li>• Features: {selectedFeatures.join(", ")}</li>
                <li>• Embedding: {embeddingConfig.method}</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={startTraining}>
              Start Training
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Section */}
      {trainingProgress === 100 && (
        <Card className="p-6 mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Model Ready!</h3>
              <p className="text-sm text-muted-foreground">
                Your model has been trained and is ready for download
              </p>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Model
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}