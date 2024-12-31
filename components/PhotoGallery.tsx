'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface WeddingPhoto {
  id: string
  photoUrl: string
}

export default function PhotoGallery({ weddingId }: { weddingId: string }) {
  const [photos, setPhotos] = useState<WeddingPhoto[]>([])

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch(`/api/photo-weddings?weddingId=${weddingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch photos')
        }
        const data: WeddingPhoto[] = await response.json()
        setPhotos(data)
      } catch (error) {
        console.error('Error fetching photos:', error)
      }
    }

    fetchPhotos()
  }, [weddingId])

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden border rounded-lg"
          >
            {/* Gunakan elemen img jika tidak memerlukan optimasi dari Next.js */}
            <Image
              src={photo.photoUrl}
              width={400}
              height={400}
              alt="Wedding photo"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
