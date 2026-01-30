'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Quote, ArrowRight } from 'lucide-react'

const featuredTestimonials = [
  {
    id: 1,
    name: 'Anonymous',
    text: 'The remote pranic healing session was incredibly calming. I felt a sense of peace and lightness that I hadn\'t experienced in months.',
    outcome: 'Emotional relief and peace',
  },
  {
    id: 2,
    name: 'R.P.',
    text: 'After several sessions, I noticed a significant improvement in my stress levels and overall emotional balance. The healing approach is gentle.',
    outcome: 'Reduced stress & improved balance',
  },
  {
    id: 3,
    name: 'S.K.',
    text: 'Preyanka\'s compassionate approach made me feel safe and supported throughout my healing journey. The sessions have been transformative.',
    outcome: 'Transformative healing experience',
  },
]

export default function TestimonialTeaser() {
  return (
    <section className="py-20 bg-gradient-to-br from-lavender-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Client Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories of transformation and peace from our healing community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 relative hover:shadow-xl transition-shadow border border-lavender-100"
            >
              <Quote className="w-8 h-8 text-primary-200 absolute top-6 right-8" />
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic line-clamp-4 text-sm md:text-base">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="pt-4 border-t border-gray-100">
                <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-primary-600 font-medium">{testimonial.outcome}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/testimonials"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold text-lg group"
          >
            <span>Read all testimonials</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

