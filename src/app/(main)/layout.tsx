import React from 'react';
import BottomNav from '@/components/layout/bottom-nav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Add padding to the bottom to prevent content from being hidden by the fixed nav bar */}
      <main className="flex-grow pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
