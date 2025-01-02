'use client';

import { useState, useEffect } from 'react';
import { Background } from '@/types/background';

interface WeddingHeaderProps {
  brideName: string;
  groomName: string;
  weddingId: string;
}

export function WeddingHeader({ brideName, groomName, weddingId }: WeddingHeaderProps) {
    const [background, setBackground] = useState<Background[]>([]);

  useEffect(() => {
    async function fetchBackground() {
      try {
        const response = await fetch(`/api/background?weddingId=${weddingId}`);
        if (response.ok) {
          const data: Background[]  = await response.json();
          setBackground(data);
        }
      } catch (error) {
        console.error('Error fetching background:', error);
      }
    }

    fetchBackground();
  }, [weddingId]);

  return (
    <div 
      className="relative min-h-[50vh] flex items-center justify-center py-20 px-4"
      style={{
        backgroundImage: background ? `url(${background.gambar})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">
        {/* Decorative element - top */}
        <div className="w-24 h-1 bg-amber-200 mx-auto mb-8" />

        <h1 className="text-5xl md:text-6xl font-serif text-white">
          {brideName} <span className="font-normal text-amber-200">&</span> {groomName}
        </h1>

        <div className="w-16 h-0.5 bg-amber-200 mx-auto my-6" />

        <div className="space-y-2">
          <p className="text-xl text-amber-100 font-light">
            Dear
          </p>
          <p className="text-xl text-amber-100 font-light mt-4">
            You are cordially invited to our wedding celebration
          </p>
        </div>

        {/* Decorative element - bottom */}
        <div className="w-24 h-1 bg-amber-200 mx-auto mt-8" />
      </div>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-amber-200/60" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-amber-200/60" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-amber-200/60" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-amber-200/60" />
    </div>
    
  );
}