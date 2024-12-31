import { PhotoweddingsTable } from '@/components/photo-wedding/table';
import { PhotoWeddingsHeader } from '@/components/photo-wedding/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import prisma from '@/lib/prisma';


async function getPhotoWeddings() {
  try {
    const photoweddings = await prisma.weddingPhoto.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return photoweddings;
  } catch (error) {
    console.error('Error fetching weddings:', error);
    return [];
  }
}

export default async function photoweddings() {
  const photoweddings = await getPhotoWeddings();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-t-lg">
          <PhotoWeddingsHeader />
        </CardHeader>
        <CardContent className="p-6">
          <PhotoweddingsTable Photoweddings={photoweddings} />
        </CardContent>
      </Card>
    </div>
  );
}