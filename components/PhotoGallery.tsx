'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';

interface WeddingPhoto {
  id: string;
  photoUrl: string;
}

export default function PhotoGallery({ weddingId }: { weddingId: string }) {
  const [photos, setPhotos] = useState<WeddingPhoto[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch(`/api/photo-weddings?weddingId=${weddingId}`);
        if (!response.ok) throw new Error('Failed to fetch photos');
        const data: WeddingPhoto[] = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    }

    fetchPhotos();
  }, [weddingId]);

  return (
    <Card className="relative overflow-hidden border-none shadow-xl bg-white">
      {/* Batik Pattern Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/batik-pattern.png')`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
        }}
      />

      <CardHeader className="relative z-10 bg-gradient-to-r from-amber-50 to-rose-50 border-b border-amber-100">
        <div className="flex items-center justify-center gap-2">
          <Camera className="w-6 h-6 text-amber-700" />
          <CardTitle className="text-2xl font-serif text-amber-900">
            Galeri Foto
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg border-4 border-amber-100 shadow-md transition-transform hover:scale-[1.02]"
            >
              <Image
                src={photo.photoUrl}
                width={400}
                height={400}
                alt="Wedding photo"
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}