'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton'; // Or your preferred loading indicator

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    // You can show a loading spinner or skeleton screen here
    return (
        <div className="flex justify-center items-center h-screen">
             <p>Loading...</p> 
             {/* Or replace with a more sophisticated Skeleton loader */}
        </div>
       
    );
  }

  if (!currentUser) {
    router.push('/login'); // Redirect to login if not authenticated
    return null; // Return null while redirecting
  }

  // If authenticated, render the children components
  return <>{children}</>;
}
