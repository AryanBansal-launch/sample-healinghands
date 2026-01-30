'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Brain, Users, Baby, Wind } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    title: 'Pranic Healing (Remote)',
    description: 'Energy healing sessions conducted remotely to restore balance and vitality to your energy body.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Heart,
    title: 'Aura & Chakra Cleansing',
    description: 'Gentle cleansing of your aura and chakras to remove negative energy and restore harmony.',
    color: 'from-lavender-500 to-lavender-600',
  },
  {
    icon: Brain,
    title: 'Emotional & Mental Wellness Support',
    description: 'Compassionate support for emotional healing, stress relief, and mental clarity.',
    color: 'from-gold-500 to-gold-600',
  },
  {
    icon: Users,
    title: 'Relationship & Prosperity Healing',
    description: 'Energy healing to support healthy relationships and attract abundance into your life.',
    color: 'from-primary-500 to-lavender-500',
  },
  {
    icon: Baby,
    title: 'Child & Student Healing',
    description: 'Specialized healing sessions for children and students to support their growth and well-being.',
    color: 'from-lavender-500 to-gold-500',
  },
  {
    icon: Wind,
    title: 'Yoga, Breathing & Meditation',
    description: 'Guided practices to enhance your healing journey and maintain inner peace.',
    color: 'from-gold-500 to-primary-500',
  },
]

export default function WhatWeDo() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What We Do
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive energy healing services to support your journey to wellness
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium group"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

