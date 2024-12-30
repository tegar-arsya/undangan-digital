'use client';

import { motion } from 'framer-motion';
import { templates } from '../data/templates';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ShowcaseSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Stunning Templates
          </motion.h2>
          <p className="text-xl text-gray-600">Choose from our collection of beautifully crafted designs</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {templates.map((template, index) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image 
                  src={template.image} 
                  alt={template.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-semibold mb-2">{template.title}</h3>
                  <Button variant="secondary" className="bg-white/90 hover:bg-white text-pink-600">
                    Use This Template
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}