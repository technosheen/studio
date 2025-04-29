import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function GroupsPage() {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
           <Users className="h-8 w-8" /> Groups & Forum
        </h1>
      </header>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Community Forum</CardTitle>
          <CardDescription>Connect with others, organize cleanups, and share progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction. Soon you'll be able to:
          </p>
          <ul className="list-disc list-inside mt-2 text-muted-foreground">
            <li>Join or create local cleanup groups.</li>
            <li>Discuss cleanup strategies and findings.</li>
            <li>Organize group cleanup events.</li>
            <li>Share photos and celebrate successes!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
