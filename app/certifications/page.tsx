'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award } from 'lucide-react'

const certifications = [
  {
    id: 1,
    title: 'Pranic Healer',
    description: 'Certified in Pranic Healing techniques for energy body cleansing and restoration.',
    image: '/certificates/pranic-healer.jpg', // Placeholder - replace with actual image paths
  },
  {
    id: 2,
    title: 'Crystal Healing',
    description: 'Trained in crystal healing modalities for chakra balancing and energy work.',
    image: '/certificates/crystal-healing.jpg',
  },
  {
    id: 3,
    title: 'Angel Healing',
    description: 'Certified in Angel Healing practices for spiritual guidance and support.',
    image: '/certificates/angel-healing.jpg',
  },
  {
    id: 4,
    title: 'Divine Healing',
    description: 'Advanced training in Divine Healing techniques for deep transformation.',
    image: '/certificates/divine-healing.jpg',
  },
  {
    id: 5,
    title: 'Counselor',
    description: 'Professional counseling certification for emotional and mental wellness support.',
    image: '/certificates/counselor.jpg',
  },
  {
    id: 6,
    title: 'Yoga Trainer',
    description: 'Certified yoga instructor specializing in therapeutic and healing practices.',
    image: '/certificates/yoga-trainer.jpg',
  },
  {
    id: 7,
    title: 'Astrologer & Numerologist',
    description: 'Expertise in astrology and numerology for deeper insights into energetic patterns.',
    image: '/certificates/astrologer-numerologist.jpg',
  },
]

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null)

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Certifications & Credentials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted expertise backed by professional training and certifications
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-lavender-100 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Award className="w-16 h-16 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {cert.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {cert.description}
              </p>
              <p className="text-primary-600 text-sm font-medium mt-4 group-hover:underline">
                Click to view certificate →
              </p>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative"
              >
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="p-8">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                    {selectedCert.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {selectedCert.description}
                  </p>
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-lavender-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Award className="w-24 h-24 text-primary-600 mx-auto mb-4" />
                      <p className="text-gray-500 italic">
                        Certificate Image Placeholder
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Upload certificate image: {selectedCert.image}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

