'use client';

import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users } from 'lucide-react';

interface RSVP {
  id: string;
  name: string;
  attendance: string;
  komentar: string;
  createdAt: Date;
}

interface RSVPSummaryTableProps {
  rsvps: RSVP[];
}

export function RSVPSummaryTable({ rsvps }: RSVPSummaryTableProps) {
  const attendingCount = rsvps.filter(rsvp => rsvp.attendance === 'yes').length;

  return (
    <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">
            RSVP Responses
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium text-gray-600">
                Attending: {attendingCount}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">
                Total Responses: {rsvps.length}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-600">Guest Name</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                <TableHead className="font-semibold text-gray-600">Message</TableHead>
                <TableHead className="font-semibold text-gray-600">Response Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvps.map((rsvp) => (
                <TableRow key={rsvp.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">{rsvp.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={rsvp.attendance === 'yes' ? 'default' : 'secondary'}
                      className={rsvp.attendance === 'yes' ? 'bg-emerald-500' : ''}
                    >
                      {rsvp.attendance === 'yes' ? 'Attending' : 'Not Attending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {rsvp.komentar || '-'}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {format(new Date(rsvp.createdAt), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}