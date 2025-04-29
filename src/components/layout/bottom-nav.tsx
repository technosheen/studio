'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Users, UserCircle } from 'lucide-react'; // Removed Map, kept others
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/location', label: 'Location', icon: MapPin }, // Renamed label to 'Location' (covers logging and map)
  { href: '/groups', label: 'Groups', icon: Users },
  // { href: '/heatmap', label: 'Heatmap', icon: Map }, // Removed Heatmap
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border shadow-md z-50">
      <div className="container mx-auto h-full">
        <ul className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            // Adjust isActive logic if needed, especially for '/location'
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1 text-center">
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center w-full h-full text-sm transition-colors duration-200',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={cn('h-6 w-6 mb-1', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
