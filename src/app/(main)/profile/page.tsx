import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserCircle } from 'lucide-react'; // Changed to UserCircle for profile
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  // Placeholder user data - replace with actual auth data later
  const user = {
    name: 'Beach Guardian',
    email: 'guardian@beachwise.app',
    memberSince: 'July 2024',
    cleanupsLogged: 0, // Placeholder
    trashItemsCollected: 0, // Placeholder
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <UserCircle className="h-8 w-8" /> User Profile
        </h1>
      </header>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Account Details</h3>
            <p><span className="font-medium text-muted-foreground">Member Since:</span> {user.memberSince}</p>
            {/* Add more user details here as needed */}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Cleanup Stats</h3>
            <p><span className="font-medium text-muted-foreground">Cleanups Logged:</span> {user.cleanupsLogged}</p>
            <p><span className="font-medium text-muted-foreground">Trash Items Collected:</span> {user.trashItemsCollected}</p>
            {/* More stats can be added */}
          </div>

           <div>
             <h3 className="text-lg font-semibold text-foreground mb-2">Settings</h3>
             {/* Placeholder for settings - Link to settings page or show inline options */}
             <Button variant="outline" disabled>Account Settings (Coming Soon)</Button>
           </div>

            <div>
             <h3 className="text-lg font-semibold text-foreground mb-2">Authentication</h3>
             {/* Firebase Auth UI or custom login/logout button will go here */}
             <Button variant="destructive" disabled>Log Out (Coming Soon)</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
