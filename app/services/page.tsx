'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Brain, Users, Baby, Home } from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    title: 'Remote Pranic Healing',
    description: 'Experience the power of pranic healing from the comfort of your home. Remote sessions allow healing energy to be transmitted across distances, supporting your energy body in restoring balance and vitality. This gentle, non-invasive approach helps clear energetic blockages and promotes natural healing.',
    benefits: [
      'Convenient remote sessions',
      'Energy body cleansing',
      'Stress and tension relief',
      'Supports overall wellness',
    ],
  },
  {
    icon: Heart,
    title: 'Emotional & Mental Wellness Support',
    description: 'Compassionate support for your emotional and mental well-being. Our sessions help address emotional imbalances, support mental clarity, and provide a safe space for processing feelings. This complementary wellness approach works alongside your existing self-care practices.',
    benefits: [
      'Emotional balance support',
      'Mental clarity enhancement',
      'Stress and anxiety relief',
      'Compassionate guidance',
    ],
  },
  {
    icon: Brain,
    title: 'Stress, Anxiety & Trauma Support',
    description: 'Gentle energy healing to support your journey through stress, anxiety, and trauma. Our approach helps restore balance to your energy body, which may support emotional processing and resilience. We work with compassion and respect for your healing timeline.',
    benefits: [
      'Gentle trauma support',
      'Anxiety relief',
      'Stress reduction',
      'Emotional resilience building',
    ],
  },
  {
    icon: Users,
    title: 'Relationship & Life Balance Support',
    description: 'Energy healing sessions designed to support healthy relationships and life balance. We work with the energetic aspects of relationships, helping to clear blockages that may affect communication, connection, and harmony in your personal and professional life.',
    benefits: [
      'Relationship harmony support',
      'Communication enhancement',
      'Life balance restoration',
      'Prosperity energy work',
    ],
  },
  {
    icon: Baby,
    title: 'Child & Student Wellness Support',
    description: 'Specialized healing sessions tailored for children and students. These gentle sessions support their growth, learning, and emotional well-being. We work with parents and guardians to ensure a safe, supportive healing experience for young ones.',
    benefits: [
      'Child-friendly approach',
      'Learning support',
      'Emotional wellness for youth',
      'Gentle energy work',
    ],
  },
  {
    icon: Home,
    title: 'Space Energy Cleansing (Home / Office)',
    description: 'Clear and harmonize the energy of your living or working spaces. Space cleansing helps remove accumulated negative energy, creating a more peaceful and positive environment. This can support productivity, harmony, and overall well-being in your space.',
    benefits: [
      'Home energy clearing',
      'Office space harmonization',
      'Positive environment creation',
      'Peaceful atmosphere support',
    ],
  },
]

export default function ServicesPage() {
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
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Healing Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive energy healing services to support your journey to wellness and balance
          </p>
          <div className="mt-6 p-4 bg-white/80 rounded-lg inline-block border border-primary-100 shadow-sm">
            <p className="text-sm text-gray-600 italic">
              All services are complementary wellness practices. Results may vary and are not guaranteed.
            </p>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-12 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 md:p-12 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-lavender-500 flex items-center justify-center">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start space-x-2">
                          <span className="text-primary-600 font-bold mt-1">✓</span>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Leaflet Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Detailed Healing Guide
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Explore our comprehensive guide to energy healing, pranic healing, and the benefits 
                  of our sessions. This leaflet provides deeper insights into how energy body 
                  cleansing can support your emotional and mental well-being.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-primary-600 font-bold mt-1">✨</span>
                    <p className="text-gray-700">Detailed breakdown of healing techniques</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-primary-600 font-bold mt-1">✨</span>
                    <p className="text-gray-700">Understanding aura and chakra cleansing</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-primary-600 font-bold mt-1">✨</span>
                    <p className="text-gray-700">Complementary wellness approach</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 relative min-h-[400px]">
                <Image
                  src="/leaflet.jpeg"
                  alt="Healing Hands Service Leaflet"
                  fill
                  className="object-contain p-4 md:p-8"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Ready to Begin Your Healing Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Book a session today and experience the support of energy healing
            </p>
            <a
              href="/book-session"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book a Healing Session
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
