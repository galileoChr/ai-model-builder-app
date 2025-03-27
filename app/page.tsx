"use client";

import { ArrowRight, Brain, Code, Database, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Natural Language Model Building",
      description: "Describe your ML task in plain English and let our AI handle the rest"
    },
    {
      icon: <LineChart className="h-8 w-8" />,
      title: "Real-time Training Insights",
      description: "Watch your model train with live metrics and visualizations"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Model Management",
      description: "Store, download, and manage your trained models effortlessly"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Flexible Integration",
      description: "Export models in multiple formats for easy integration"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-background to-secondary">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Build AI Models with Natural Language
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mb-8">
          Transform your ideas into production-ready AI models using simple English prompts. 
          No coding required.
        </p>
        <Link href="/builder">
          <Button size="lg" className="group">
            Start Building
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 transition-all hover:shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-secondary py-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your AI Model?</h2>
          <p className="text-muted-foreground mb-8 max-w-[600px] mx-auto">
            Get started now and create your first AI model in minutes. 
            No machine learning expertise required.
          </p>
          <Link href="/builder">
            <Button size="lg" variant="secondary" className="group">
              Create Your First Model
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer with Copyright */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Copyright © 2025 Christophe Manzi. All rights reserved.</p>
      </footer>
    </main>
  );
}