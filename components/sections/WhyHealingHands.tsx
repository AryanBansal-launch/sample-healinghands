'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const benefits = [
  'Experienced healer with multiple certifications',
  'Remote healing support from anywhere',
  'Gentle & non-invasive approach',
  'Energy-based wellness methodology',
  'Personalized sessions tailored to your needs',
]

/** Filenames in `public/collage/` — add or remove as you update the folder. */
const COLLAGE_FILES = [
  'WhatsApp Image 2026-01-29 at 10.46.46 PM (1).jpeg',
  'WhatsApp Image 2026-04-23 at 10.07.32 AM.jpeg',
  'WhatsApp Image 2026-04-23 at 10.07.33 AM.jpeg',
  'WhatsApp Image 2026-04-23 at 10.07.34 AM.jpeg',
  'WhatsApp Image 2026-04-25 at 5.16.50 PM.jpeg',
  'WhatsApp Image 2026-04-26 at 10.58.16 PM.jpeg',
] as const

function collageSrc(filename: string) {
  return `/collage/${encodeURIComponent(filename)}`
}

const AUTO_MS = 5200

function CollageCarousel() {
  const reduceMotion = useReducedMotion()
  /** Copy so length is `number`, not literal `6` — avoids TS rejecting `length === 0` in production build. */
  const slides: string[] = [...COLLAGE_FILES]
  const [index, setIndex] = useState(0)

  const go = useCallback((i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1 || reduceMotion) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [slides.length, reduceMotion])

  if (slides.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-primary-200 to-lavender-200 rounded-xl flex items-center justify-center">
        <p className="text-gray-600 text-sm px-4 text-center">Add images to <code className="text-xs">public/collage</code></p>
      </div>
    )
  }

  const current = slides[index]

  return (
    <div
      className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-inner"
      aria-roledescription="carousel"
      aria-label="Photo collage from healing sessions"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={collageSrc(current)}
            alt={`Healing hands collage, image ${index + 1} of ${slides.length}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* subtle gradient at bottom for dots contrast */}
      <div
        className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none"
        aria-hidden
      />

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-white shadow' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Show image ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  )
}

export default function WhyHealingHands() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-lavender-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why The Healing Hands
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trusted energy healing with a compassionate, experienced approach
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {benefit}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl"
          >
            <CollageCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
