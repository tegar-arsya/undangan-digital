import { WeddingsTable } from '@/components/weddings/weddings-table';
import { WeddingsHeader } from '@/components/weddings/weddings-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import prisma from '@/lib/prisma';

async function getWeddings() {
  try {
    const weddings = await prisma.wedding.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return weddings;
  } catch (error) {
    console.error('Error fetching weddings:', error);
    return [];
  }
}

export default async function AdminWeddings() {
  const weddings = await getWeddings();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-t-lg">
          <WeddingsHeader />
        </CardHeader>
        <CardContent className="p-6">
          <WeddingsTable weddings={weddings} />
        </CardContent>
      </Card>
    </div>
  );
}