import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Map, BarChart2 } from 'lucide-react'; // Using BarChart2 for analytics

export default function HeatmapPage() {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Map className="h-8 w-8" /> Heatmap & Analytics
        </h1>
      </header>

      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle>Trash Heatmap</CardTitle>
          <CardDescription>Visualize trash concentration based on logged data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
            Heatmap visualization coming soon!
          </div>
           {/* Placeholder for map legends or controls */}
        </CardContent>
      </Card>

       <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <BarChart2 className="h-6 w-6" /> Insights & Analytics
          </CardTitle>
          <CardDescription>Analyze cleanup data and trends.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground">
            Data analysis features are under development. Planned features include:
          </p>
           <ul className="list-disc list-inside mt-2 text-muted-foreground">
             <li>Most common types of trash found.</li>
             <li>Trends over time.</li>
             <li>Impact of cleanup efforts.</li>
             <li>Data export options.</li>
           </ul>
        </CardContent>
      </Card>
    </div>
  );
}
