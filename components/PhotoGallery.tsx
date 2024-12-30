'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface WeddingPhoto {
  id: string
  photoUrl: string
}

export default function PhotoGallery({ weddingId }: { weddingId: string }) {
  const [photos, setPhotos] = useState<WeddingPhoto[]>([])

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch(`/api/photos/${weddingId}`)
        const data = await response.json()
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
          <div key={photo.id} className="relative aspect-square">
            <Image
              src={photo.photoUrl}
              alt="Wedding photo"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  )
}