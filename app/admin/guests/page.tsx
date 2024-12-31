import { GuestsTable } from '@/components/guests/table';
import { GuestsHeader } from '@/components/guests/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import prisma from '@/lib/prisma';


async function getGuests() {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return guests.map((guest) => ({
      ...guest,
      email: guest.email ?? '', // provide a default value for email if it's null
    }));
  } catch (error) {
    console.error('Error fetching weddings:', error);
    return [];
  }
}

export default async function AdminGuets() {
  const guests = await getGuests();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-t-lg">
          <GuestsHeader />
        </CardHeader>
        <CardContent className="p-6">
          <GuestsTable guests={guests} />
        </CardContent>
      </Card>
    </div>
  );
}