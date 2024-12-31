'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2} from 'lucide-react';
import Link from 'next/link';
import { useGuests } from '@/hooks/action/useGuest';

interface Guest {
  id: string;
  weddingId: string;
  name: string;
  email: string;
  slug: string;
  createdAt: Date;
}

interface GuestsTableProps {
  guests: Guest[];
}

export function GuestsTable({ guests: initialGuests }: GuestsTableProps) {
  const { guests, handleDelete } = useGuests(initialGuests);
  return (
    <div className="rounded-lg border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-600">Weding ID</TableHead>
            <TableHead className="font-semibold text-gray-600">name</TableHead>
            <TableHead className="font-semibold text-gray-600">email</TableHead>
            <TableHead className="font-semibold text-gray-600">slug</TableHead>
            <TableHead className="font-semibold text-gray-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guests) => {
            // const weddingDate = new Date(wedding.date);
            // const isUpcoming = weddingDate > new Date();
            
            return (
              <TableRow key={guests.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {guests.weddingId}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {guests.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {guests.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {guests.slug}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                <div className="flex space-x-2">
                    <Link href={`/admin/guests/${guests.id}/edit`}>
                      <Button variant="outline" size="sm" className="hover:bg-gray-100 hover:text-gray-900">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-100 hover:text-red-900"
                      onClick={() => handleDelete(guests.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}