'use client'

import { motion } from 'framer-motion'
import { CalendarCheck, MessageSquare, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: CalendarCheck,
    title: 'Book Your Session',
    description: 'Select a service and choose a time slot that works for you through our online booking form.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: MessageSquare,
    title: 'Share Your Concerns',
    description: 'Once booked, we\'ll connect via WhatsApp or email to understand your specific needs and concerns.',
    color: 'bg-lavender-100 text-lavender-600',
  },
  {
    icon: Sparkles,
    title: 'Receive Healing',
    description: 'Relax at home while I perform the remote energy healing session to restore your balance and vitality.',
    color: 'bg-gold-100 text-gold-600',
  },
]

export default function HowItWorks() {
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
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the benefits of remote energy healing in three simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-100 via-lavender-100 to-gold-100 -translate-y-1/2 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative z-10 text-center"
                >
                  <div className={`w-20 h-20 mx-auto rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

