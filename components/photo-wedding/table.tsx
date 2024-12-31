'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2} from 'lucide-react';
import Link from 'next/link';

interface Photowedding {
  id: string;
  weddingId: string;
  name: string;
  photoUrl: string;
}

interface PhotoweddingsTableProps {
  Photoweddings: Photowedding[];
}

export function PhotoweddingsTable({ Photoweddings }: PhotoweddingsTableProps) {
  return (
    <div className="rounded-lg border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-600">Weding ID</TableHead>
            <TableHead className="font-semibold text-gray-600">name</TableHead>
            <TableHead className="font-semibold text-gray-600">gambar</TableHead>
            <TableHead className="font-semibold text-gray-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Photoweddings.map((Photoweddings) => {
            // const weddingDate = new Date(wedding.date);
            // const isUpcoming = weddingDate > new Date();
            
            return (
              <TableRow key={Photoweddings.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {Photoweddings.weddingId}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {Photoweddings.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {Photoweddings.photoUrl}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/photo-wedding/${Photoweddings.id}/edit`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}