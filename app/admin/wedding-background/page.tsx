import { BackgroundsTable } from '@/components/wedding-background/table';
import { BackgroundsHeader } from '@/components/wedding-background/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import prisma from '@/lib/prisma';


async function getBackgrounds() {
  try {
    const backgrounds = await prisma.background.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return backgrounds;
  } catch (error) {
    console.error('Error fetching weddings:', error);
    return [];
  }
}

export default async function background() {
  const backgrounds = await getBackgrounds();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-t-lg">
          <BackgroundsHeader />
        </CardHeader>
        <CardContent className="p-6">
          <BackgroundsTable Backgrounds={backgrounds} />
        </CardContent>
      </Card>
    </div>
  );
}