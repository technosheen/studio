'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '@/lib/firebase'; // Corrected import path
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async () => {
    setError(null);
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Add user document to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email, // Store email
        createdAt: new Date(), // Optional: store creation timestamp
        // Add any other default profile fields here
        displayName: user.email?.split('@')[0] || 'User' // Example: Set initial display name
      });

      router.push('/profile'); // Redirect to profile page after signup
    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(err.message || "Failed to create account.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>Create an account to get started.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm font-medium p-2 bg-red-100 dark:bg-red-900 rounded-md">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
            <Button onClick={handleSignup} className="w-full">Sign Up</Button>
             <Button variant="link" size="sm" onClick={() => router.push('/login')}>Already have an account? Log in</Button>
          </CardFooter>
      </Card>
    </div>
  );
}