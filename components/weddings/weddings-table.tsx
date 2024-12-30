'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Calendar, MapPin, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useWeddings } from '@/hooks/useWeddings';

interface Wedding {
  id: string;
  brideName: string;
  groomName: string;
  date: string;
  location: string;
}

interface WeddingsTableProps {
  weddings: Wedding[];
}

export function WeddingsTable({ weddings: initialWeddings }: WeddingsTableProps) {
  const { weddings, handleDelete } = useWeddings(initialWeddings);

  return (
    <div className="rounded-lg border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-600">Couple</TableHead>
            <TableHead className="font-semibold text-gray-600">Date</TableHead>
            <TableHead className="font-semibold text-gray-600">Location</TableHead>
            <TableHead className="font-semibold text-gray-600">Status</TableHead>
            <TableHead className="font-semibold text-gray-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weddings.map((wedding) => {
            const weddingDate = new Date(wedding.date);
            const isUpcoming = weddingDate > new Date();

            return (
              <TableRow key={wedding.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{wedding.brideName}</span>
                    <span className="text-gray-500 text-sm">& {wedding.groomName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {weddingDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {wedding.location}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={isUpcoming ? 'default' : 'secondary'}
                    className={isUpcoming ? 'bg-emerald-500' : ''}
                  >
                    {isUpcoming ? 'Upcoming' : 'Past'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/weddings/${wedding.id}/edit`}>
                      <Button variant="outline" size="sm" className="hover:bg-gray-100 hover:text-gray-900">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-100 hover:text-red-900"
                      onClick={() => handleDelete(wedding.id)}
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
