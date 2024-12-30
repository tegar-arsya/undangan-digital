'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://player.vimeo.com/external/374180558.hd.mp4?s=fa9c5c8d19d5b646cf3f5b114c2a928d7a4c5b99&profile_id=175" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Create Magical Digital Wedding Invitations
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Transform your love story into an enchanting digital experience
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/templates">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Browse Templates
              </Button>
            </Link>
            <Link href="/create">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Start Creating
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}