"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface ModelArchitectureProps {
  architecture: {
    type: string;
    task: string;
    config: {
      layers: number;
      heads: number;
      embedding_dim: number;
    };
  };
}

export function ModelArchitecture({ architecture }: ModelArchitectureProps) {
  const layerData = Array.from({ length: architecture.config.layers }, (_, i) => ({
    name: `Layer ${i + 1}`,
    neurons: architecture.config.embedding_dim,
    attention: architecture.config.heads
  }));

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Model Architecture</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="text-lg font-medium">{architecture.type}</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">Task</p>
            <p className="text-lg font-medium">{architecture.task}</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">Total Parameters</p>
            <p className="text-lg font-medium">
              {(architecture.config.layers * architecture.config.embedding_dim * architecture.config.heads).toLocaleString()}
            </p>
          </div>
        </div>

        <Tabs defaultValue="structure">
          <TabsList>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="structure" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={layerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="neurons" fill="hsl(var(--primary))" name="Neurons" />
                <Bar dataKey="attention" fill="hsl(var(--secondary))" name="Attention Heads" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="metrics">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Embedding Dimension: {architecture.config.embedding_dim}
              </p>
              <p className="text-sm text-muted-foreground">
                Attention Heads: {architecture.config.heads}
              </p>
              <p className="text-sm text-muted-foreground">
                Number of Layers: {architecture.config.layers}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}