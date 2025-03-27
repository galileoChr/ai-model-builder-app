"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Network, Cpu, Database, LineChart } from "lucide-react";
import { KnowledgeGraph } from "../builder/components/knowledge-graph";
import { ModelArchitecture } from "../builder/components/model-architecture";

// Sample data for demonstration
const sampleKnowledgeGraph = {
  nodes: [
    { id: "1", label: "Text Classification" },
    { id: "2", label: "Sentiment Analysis" },
    { id: "3", label: "Natural Language" },
    { id: "4", label: "Machine Learning" },
    { id: "5", label: "Neural Networks" },
    { id: "6", label: "Deep Learning" },
  ],
  links: [
    { source: "1", target: "3", label: "uses" },
    { source: "2", target: "3", label: "analyzes" },
    { source: "3", target: "4", label: "implements" },
    { source: "4", target: "5", label: "utilizes" },
    { source: "5", target: "6", label: "part of" },
  ],
};

const sampleArchitecture = {
  type: "transformer",
  task: "text-classification",
  config: {
    layers: 6,
    heads: 8,
    embedding_dim: 512,
  },
};

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState("knowledge");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Brain className="h-8 w-8" />
        <h1 className="text-3xl font-bold">AI Model Features</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="knowledge" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Knowledge Graph</span>
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center space-x-2">
            <Cpu className="h-4 w-4" />
            <span>Model Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Data Processing</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center space-x-2">
            <LineChart className="h-4 w-4" />
            <span>Model Metrics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Knowledge Graph Analysis</h2>
            <p className="text-muted-foreground mb-6">
              Visualize the relationships between concepts extracted from your model requirements.
            </p>
            <KnowledgeGraph data={sampleKnowledgeGraph} />
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Model Architecture</h2>
            <p className="text-muted-foreground mb-6">
              Explore the structure and components of your AI model.
            </p>
            <ModelArchitecture architecture={sampleArchitecture} />
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Data Processing Pipeline</h2>
            <p className="text-muted-foreground mb-6">
              Monitor and configure your data preprocessing steps.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-secondary">
                <h3 className="font-medium mb-2">Data Cleaning</h3>
                <p className="text-sm text-muted-foreground">Remove noise and inconsistencies</p>
              </Card>
              <Card className="p-4 bg-secondary">
                <h3 className="font-medium mb-2">Feature Extraction</h3>
                <p className="text-sm text-muted-foreground">Identify key characteristics</p>
              </Card>
              <Card className="p-4 bg-secondary">
                <h3 className="font-medium mb-2">Data Augmentation</h3>
                <p className="text-sm text-muted-foreground">Enhance training dataset</p>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Model Performance Metrics</h2>
            <p className="text-muted-foreground mb-6">
              Track and analyze your model's performance metrics.
            </p>
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
    </div>
  );
}