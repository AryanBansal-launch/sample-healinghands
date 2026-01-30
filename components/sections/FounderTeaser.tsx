'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function FounderTeaser() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 relative"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-primary-200 to-lavender-200 rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <Image
                src="/banner2.jpeg"
                alt="Preyanka Jain - Founder of Healing Hands"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-serif text-2xl font-bold">Preyanka Jain</p>
                <p className="text-white/90 text-sm">Founder & Energy Healer</p>
              </div>
            </div>
            {/* Decorative background shape */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold-100/50 rounded-full blur-3xl -z-0" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl -z-0" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet the Founder
            </h2>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed mb-8">
              <p>
                &quot;Healing starts from within. When we clear the energy, we create space for peace,
                clarity, and transformation.&quot;
              </p>
              <p>
                Welcome, I am Preyanka Jain. My journey into energy healing started with a desire to
                understand the subtle energies that influence our well-being. Today, I am dedicated to
                helping you restore balance and find inner peace through compassionate support.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>Read My Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

