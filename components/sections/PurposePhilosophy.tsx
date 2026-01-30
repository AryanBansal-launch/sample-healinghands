'use client'

import { motion } from 'framer-motion'
import { Heart, Sparkles, Sun } from 'lucide-react'

export default function PurposePhilosophy() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Purpose & Philosophy
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
            <p>
              At Healing Hands, we believe in the power of energy healing to support your journey toward
              wellness. Our approach focuses on <strong>energy body cleansing</strong>, helping to remove
              accumulated stress, negative emotions, and energetic blockages that may be affecting your
              well-being.
            </p>
            <p>
              Through gentle, non-invasive techniques, we support <strong>emotional balance</strong> and
              help you find <strong>inner peace & clarity</strong>. Our healing sessions are designed to
              complement your overall wellness journey, working alongside any other treatments or practices
              you may be following.
            </p>
            <p>
              Our mission is to help you feel <strong>lighter, calmer &amp; aligned</strong> with your true
              self. We understand that healing is a personal journey, and we&apos;re here to provide
              compassionate support every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Sparkles, text: 'Energy Body Cleansing' },
              { icon: Heart, text: 'Emotional Balance' },
              { icon: Sun, text: 'Inner Peace & Clarity' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 bg-gradient-to-br from-primary-50 to-lavender-50 rounded-xl"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                  <p className="font-semibold text-gray-800">{item.text}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

