'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface UserProfileData {
  email: string;
  displayName?: string;
  createdAt?: any; // Adjust type as needed, e.g., Timestamp or Date
  cleanupsLogged?: number;
  trashItemsCollected?: number;
  // Add other fields as needed
}

export default function ProfilePage() {
  const { currentUser, loading: authLoading } = useAuth(); // Use Auth Context
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Redirect if auth is done loading and there's no user
    if (!authLoading && !currentUser) {
      router.push('/login');
      return; // Stop further execution in this effect run
    }

    // Fetch Firestore data only if currentUser exists
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const fetchedData = userDocSnap.data() as UserProfileData;
            setUserData(fetchedData);
            setNewName(fetchedData.displayName || "");
          } else {
            // Firestore doc doesn't exist, create it
            console.log("No Firestore doc, creating...");
            const initialData: UserProfileData = {
              email: currentUser.email || "N/A",
              createdAt: new Date(), // Use JS Date directly
              displayName: currentUser.email?.split('@')[0] || 'User'
            };
            await setDoc(userDocRef, initialData);
            setUserData(initialData);
            setNewName(initialData.displayName);
          }
        } catch (error) {
            console.error("Error fetching/creating user data:", error);
            toast({ title: "Error", description: "Could not load profile data.", variant: "destructive" });
            // Optionally set some default error state for userData
        }
        setLoadingData(false);
      };

      fetchData();
    }\ else {
        // Handles the case where currentUser becomes null after initial load (e.g., token expired)
        setLoadingData(false); // Ensure loading state is updated
    }

    // No dependency on router needed here as redirection is handled based on auth state
  }, [currentUser, authLoading]); // Rerun effect if auth state changes

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out Successfully" });
      router.push('/login'); // Redirect handled here, AuthContext will update state
    } catch (error) {
      console.error("Logout Error:", error);
      toast({ title: "Logout Failed", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleNameUpdate = async () => {
    if (!currentUser || !newName.trim()) {
      toast({ title: "Error", description: "Display name cannot be empty.", variant: "destructive" });
      return;
    }
    const userDocRef = doc(db, "users", currentUser.uid);
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

  // Show loading skeleton if either auth state or Firestore data is loading
  if (authLoading || loadingData) {
    return (
      <div className="container mx-auto p-4">
        <Card className="shadow-md max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Skeleton className="h-10 w-[100px]" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If loading is finished but no user or userData (should have been redirected, but safety check)
  if (!currentUser || !userData) {
    return <p>Please log in to view your profile.</p>; // Or redirect again
  }

  // Format createdAt date
  let memberSince = "N/A";
  if (userData.createdAt) {
      try {
        // Check if it's a Firestore Timestamp-like object
        if (userData.createdAt.seconds) {
            memberSince = new Date(userData.createdAt.seconds * 1000).toLocaleDateString();
        } else {
            // Try parsing as a date string or from a Date object
            memberSince = new Date(userData.createdAt).toLocaleDateString();
        }
      } catch (e) {
          console.error("Error parsing date:", userData.createdAt);
          memberSince = "Invalid Date";
      }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16">
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
            <p><span className="font-medium text-muted-foreground">Member Since:</span> {memberSince}</p>
            {/* Add more user details here */}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Cleanup Stats (Example)</h3>
            <p><span className="font-medium text-muted-foreground">Cleanups Logged:</span> {userData.cleanupsLogged || 0}</p>
            <p><span className="font-medium text-muted-foreground">Trash Items Collected:</span> {userData.trashItemsCollected || 0}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
