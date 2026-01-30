'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Anonymous',
    rating: 5,
    text: 'The remote pranic healing session was incredibly calming. I felt a sense of peace and lightness that I hadn\'t experienced in months. Highly recommend!',
    outcome: 'Emotional relief and peace',
  },
  {
    id: 2,
    name: 'R.P.',
    rating: 5,
    text: 'After several sessions, I noticed a significant improvement in my stress levels and overall emotional balance. The healing approach is gentle yet powerful.',
    outcome: 'Reduced stress and improved balance',
  },
  {
    id: 3,
    name: 'Anonymous',
    rating: 5,
    text: 'The aura cleansing spray has become a daily part of my routine. It helps create a positive atmosphere in my home and I feel more centered.',
    outcome: 'Daily positivity and centeredness',
  },
  {
    id: 4,
    name: 'S.K.',
    rating: 5,
    text: 'Preyanka\'s compassionate approach made me feel safe and supported throughout my healing journey. The sessions have been transformative.',
    outcome: 'Transformative healing experience',
  },
  {
    id: 5,
    name: 'Anonymous',
    rating: 5,
    text: 'I was skeptical at first, but the results speak for themselves. I feel lighter, more aligned, and better equipped to handle life\'s challenges.',
    outcome: 'Increased resilience and alignment',
  },
  {
    id: 6,
    name: 'M.T.',
    rating: 5,
    text: 'The space cleansing for my office was remarkable. The energy shift was noticeable, and my team has commented on the more peaceful atmosphere.',
    outcome: 'Improved workspace energy',
  },
]

export default function TestimonialsPage() {
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
            Client Experiences
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories of transformation, healing, and positive change
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300"
            >
              <Quote className="w-8 h-8 text-primary-300 mb-4" />
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="pt-4 border-t border-gray-200">
                <p className="font-semibold text-gray-900 mb-1">
                  {testimonial.name}
                </p>
                <p className="text-sm text-primary-600">
                  {testimonial.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

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
              Experience the transformative power of energy healing
            </p>
            <a
              href="/book-session"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book Your Session
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

