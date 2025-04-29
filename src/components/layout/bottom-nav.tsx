'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Users, Map, UserCircle } from 'lucide-react'; // UserCircle for profile
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/location', label: 'Location', icon: MapPin },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/heatmap', label: 'Heatmap', icon: Map },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border shadow-md z-50">
      <div className="container mx-auto h-full">
        <ul className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/location' && pathname.startsWith(item.href)); // Handle nested routes if any
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
