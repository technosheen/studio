'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from '@/lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast"; 

interface UserProfileData {
  email: string;
  displayName?: string;
  createdAt?: any; // Adjust type as needed, e.g., Timestamp
  cleanupsLogged?: number;
  trashItemsCollected?: number;
  // Add other fields as needed
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const fetchedData = userDocSnap.data() as UserProfileData;
          setUserData(fetchedData);
          setNewName(fetchedData.displayName || ""); // Initialize newName with current display name
        } else {
          // Handle case where user exists in Auth but not Firestore (shouldn't normally happen with current signup flow)
          console.log("No such document in Firestore!");
          setUserData({ email: currentUser.email || "N/A" }); // Set minimal data
           setNewName(currentUser.email?.split('@')[0] || "User");
        }
      } else {
        // No user is signed in.
        setUser(null);
        setUserData(null);
        router.push('/login'); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out Successfully" });
      router.push('/login');
    } catch (error) {
      console.error("Logout Error:", error);
      toast({ title: "Logout Failed", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleNameUpdate = async () => {
    if (!user || !newName.trim()) {
        toast({ title: "Error", description: "Display name cannot be empty.", variant: "destructive" });
        return;
    }
    const userDocRef = doc(db, "users", user.uid);
    try {
        await setDoc(userDocRef, { displayName: newName }, { merge: true });
        setUserData(prevData => prevData ? { ...prevData, displayName: newName } : null);
        setEditingName(false);
         toast({ title: "Success", description: "Display name updated." });
    } catch (error) {
        console.error("Error updating display name:", error);
        toast({ title: "Error", description: "Failed to update display name.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-3/4" />
          </CardContent>
           <CardFooter>
              <Skeleton className="h-10 w-[100px]" />
           </CardFooter>
        </Card>
      </div>
    );
  }

  if (!user || !userData) {
    // Should be redirected by useEffect, but render nothing just in case
    return null; 
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16">
            {/* Placeholder for user avatar - Add image URL if available in userData */}
            <AvatarFallback>{(userData.displayName || userData.email)?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter display name"
                  className="flex-grow"
                />
                <Button size="sm" onClick={handleNameUpdate}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingName(false)}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                 <CardTitle className="text-2xl font-bold">{userData.displayName || 'Set Display Name'}</CardTitle>
                 <Button variant="ghost" size="sm" onClick={() => setEditingName(true)}>Edit</Button>
              </div>
            )}
            <CardDescription>{userData.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Account Details</h3>
            {userData.createdAt && (
                 <p><span className="font-medium text-muted-foreground">Member Since:</span> {new Date(userData.createdAt.seconds * 1000).toLocaleDateString()}</p>
            )}
            {/* Add more user details here */}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Cleanup Stats (Example)</h3>
            <p><span className="font-medium text-muted-foreground">Cleanups Logged:</span> {userData.cleanupsLogged || 0}</p>
            <p><span className="font-medium text-muted-foreground">Trash Items Collected:</span> {userData.trashItemsCollected || 0}</p>
          </div>
          
           {/* Add other sections like Settings if needed */}

        </CardContent>
         <CardFooter className="flex justify-end">
           <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
         </CardFooter>
      </Card>
    </div>
  );
}
