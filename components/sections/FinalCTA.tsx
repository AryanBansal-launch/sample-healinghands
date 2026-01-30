'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with Image and Overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/banner3.jpeg"
          alt="Healing Journey Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/80 mix-blend-multiply" />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Sparkles className="w-12 h-12 mx-auto mb-6 text-gold-300" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your Healing Journey?
          </h2>
          <p className="text-xl text-primary-50 mb-10 max-w-2xl mx-auto">
            Experience the transformative power of energy healing. Book your session today and
            start your path toward inner peace and balance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/book-session"
              className="group bg-white text-primary-700 hover:bg-primary-50 px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <span>Book a Healing Session</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="text-white border-2 border-white/30 hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
            >
              Contact Me
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

