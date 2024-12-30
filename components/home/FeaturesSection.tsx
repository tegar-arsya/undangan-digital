'use client';

import { motion } from 'framer-motion';
import { features } from '../data/features';

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Everything You Need
          </motion.h2>
          <p className="text-xl text-gray-600">Create the perfect digital invitation with our powerful features</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="mb-4 inline-block p-3 rounded-xl bg-pink-100 group-hover:bg-pink-200 transition-colors">
                <feature.icon className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}