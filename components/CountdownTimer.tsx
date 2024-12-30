// components/CountdownTimer.tsx
'use client'

import { useState, useEffect } from 'react'
import { TimeLeft } from '@/types/wedding'

export default function CountdownTimer({ weddingDate }: { weddingDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const weddingTime = new Date(weddingDate).getTime()
      const distance = weddingTime - now

      if (distance < 0) {
        // Wedding date has passed
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [weddingDate])

  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-4">Countdown to the Big Day</h2>
      <div className="flex justify-center space-x-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <span className="text-4xl font-bold block">{value}</span>
      <p className="text-gray-600">{label}</p>
    </div>
  )
}