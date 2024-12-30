'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Weddings',
    href: '/admin/weddings',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'guests',
    href: '/admin/guests',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Wedding Backgrounds',
    href: '/admin/wedding-background',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { signOut } = useAuth();

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-200 ease-in-out',
          !isOpen && '-translate-x-full md:translate-x-0 md:w-20'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link 
            href="/admin/dashboard" 
            className={cn(
              "font-bold text-xl text-gray-900",
              !isOpen && "md:hidden"
            )}
          >
            Admin Panel
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                pathname === item.href && 'bg-gray-100 text-gray-900',
                !isOpen && 'md:justify-center md:px-2'
              )}
            >
              {item.icon}
              <span className={cn('text-sm font-medium', !isOpen && 'md:hidden')}>
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span className={cn('text-sm font-medium', !isOpen && 'md:hidden')}>
              Logout
            </span>
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={toggleSidebar}
      />

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 overflow-y-auto transition-margin duration-200 ease-in-out',
          isOpen ? 'md:ml-64' : 'md:ml-20'
        )}
      >
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}