'use client';

import { useState, useEffect } from 'react';
import { TimeLeft } from '@/types/timeleft';

export default function CountdownTimer({ weddingDate }: { weddingDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const weddingTime = new Date(weddingDate).getTime();
      const distance = weddingTime - now;

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="relative py-12">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 w-24 h-24 opacity-10"
        style={{
          backgroundImage: `url('/batik-corner.png')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          transform: 'rotate(0deg)'
        }}
      />
      <div className="absolute right-0 top-0 w-24 h-24 opacity-10"
        style={{
          backgroundImage: `url('/batik-corner.png')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          transform: 'rotate(90deg)'
        }}
      />

      <div className="text-center space-y-6">
        <h2 className="text-3xl font-serif text-amber-900">
          Menghitung Hari Bahagia
        </h2>
        
        <div className="flex justify-center gap-4 md:gap-8">
          <TimeUnit value={timeLeft.days} label="Hari" />
          <TimeUnit value={timeLeft.hours} label="Jam" />
          <TimeUnit value={timeLeft.minutes} label="Menit" />
          <TimeUnit value={timeLeft.seconds} label="Detik" />
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50 rounded-lg shadow-lg border border-amber-100">
        <span className="text-3xl font-bold text-amber-900">{value}</span>
      </div>
      <span className="mt-2 text-sm font-medium text-amber-800">{label}</span>
    </div>
  );
}