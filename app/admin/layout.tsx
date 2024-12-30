'use client';

// import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/layouts/admin-sidebar';
import { useAuth } from '@/hooks/use-auth';
import LoadingSpinner from '@/components/ui/loading-spinner';

const PUBLIC_PATHS = ['/admin/login', '/admin/register'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Tampilkan loading spinner saat mengecek autentikasi
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Jika di halaman publik, tampilkan tanpa sidebar
  if (pathname && PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // Jika terautentikasi, tampilkan dengan sidebar
  if (isAuthenticated) {
    return <AdminSidebar>{children}</AdminSidebar>;
  }

  // Jika tidak terautentikasi dan bukan di halaman publik, redirect ke login
  if (!isAuthenticated && pathname && !PUBLIC_PATHS.includes(pathname)) {
    router.push('/admin/login');
    return null;
  }

  // Fallback untuk kasus lainnya
  return <>{children}</>;
}