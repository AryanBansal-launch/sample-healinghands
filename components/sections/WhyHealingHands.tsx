'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const benefits = [
  'Experienced healer with multiple certifications',
  'Remote healing support from anywhere',
  'Gentle & non-invasive approach',
  'Energy-based wellness methodology',
  'Personalized sessions tailored to your needs',
]

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
            Why Healing Hands
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
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <div className="aspect-square bg-gradient-to-br from-primary-200 to-lavender-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">✨</span>
                </div>
                <p className="text-gray-600 italic">
                  "Healing starts from within"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

