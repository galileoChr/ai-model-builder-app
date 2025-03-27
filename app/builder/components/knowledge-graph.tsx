"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import * as d3 from "d3";

interface KnowledgeGraphProps {
  data: {
    nodes: Array<{ id: string; label: string }>;
    links: Array<{ source: string; target: string; label?: string }>;
  };
}

export function KnowledgeGraph({ data }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 800;
    const height = 400;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    // Add nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g");

    // Add circles for nodes
    node.append("circle")
      .attr("r", 5)
      .attr("fill", "hsl(var(--primary))");

    // Add labels
    node.append("text")
      .text((d: any) => d.label)
      .attr("x", 8)
      .attr("y", 3)
      .attr("font-size", "10px");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Knowledge Graph</h3>
      <div className="h-[400px] w-full">
        <svg ref={svgRef} />
      </div>
    </Card>
  );
}