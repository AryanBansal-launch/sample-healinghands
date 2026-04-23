"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";

export default function TestimonialTeaser() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => setTestimonials(data.slice(0, 3)))
      .catch((err) => console.error(err));
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-br from-lavender-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Client Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories of transformation and peace from our healing community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-8 relative hover:shadow-xl transition-all border border-lavender-100 flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-primary-50 absolute top-6 right-8" />
              <div>
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 italic line-clamp-4 text-base leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <p className="font-bold text-gray-900">{testimonial.clientName}</p>
                <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mt-1">{testimonial.tagline}</p>
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
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-bold text-lg group"
          >
            <span>Read all testimonials</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
