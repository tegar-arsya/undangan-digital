'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export function WeddingsHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle className="text-3xl font-bold text-gray-800">
          Wedding Management
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Manage and track all wedding events
        </p>
      </div>
      <Link href="/admin/weddings/create">
        <Button className="bg-rose-500 hover:bg-rose-600">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Wedding
        </Button>
      </Link>
    </div>
  );
}