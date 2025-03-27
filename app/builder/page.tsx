"use client";

import { useState } from "react";
import { Brain, Mic, Play, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const steps = [
    { icon: "🔍", title: "Interpreting Prompt", description: "Analyzing your requirements" },
    { icon: "🏗️", title: "Selecting Architecture", description: "Choosing the optimal model" },
    { icon: "📁", title: "Loading Dataset", description: "Preparing training data" },
    { icon: "🧹", title: "Preprocessing", description: "Cleaning and transforming data" },
    { icon: "🧠", title: "Training Model", description: "Learning from patterns" },
    { icon: "📊", title: "Evaluating", description: "Testing model performance" },
    { icon: "💾", title: "Saving Model", description: "Preparing for deployment" }
  ];

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setShowConfirmation(true);
  };

  const startTraining = async () => {
    setShowConfirmation(false);
    setIsProcessing(true);
    
    // Simulate progress through steps
    for (let i = 0; i <= steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Simulate training progress
    for (let i = 0; i <= 100; i += 10) {
      setTrainingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Prompt Input Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-6 w-6" />
          <h1 className="text-2xl font-bold">AI Model Builder</h1>
        </div>
        <Card className="p-4">
          <div className="flex flex-col space-y-4">
            <Textarea
              placeholder="Describe your ML task in plain English (e.g., 'Train a transformer to classify text from my CSV file')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] text-lg"
            />
            <div className="flex justify-between items-center">
              <Button variant="outline" size="icon" className="rounded-full">
                <Mic className="h-4 w-4" />
              </Button>
              <Button onClick={handleSubmit} disabled={isProcessing}>
                <Play className="h-4 w-4 mr-2" />
                Start Building
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Steps Progress */}
      <div className="grid gap-6 mb-8">
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

      {/* Training Progress */}
      {isProcessing && currentStep === 4 && (
        <Card className="p-6 mb-8">
          <h3 className="font-semibold mb-4">Training Progress</h3>
          <Progress value={trainingProgress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Training progress: {trainingProgress}%
          </p>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Model Building</DialogTitle>
            <DialogDescription>
              You're about to start building an AI model based on your description. 
              This process will analyze your requirements and create a custom model.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={startTraining}>
              Start Building
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Section */}
      {trainingProgress === 100 && (
        <Card className="p-6">
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