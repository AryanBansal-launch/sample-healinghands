"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="min-h-screen pt-32 text-center text-gray-600">Loading testimonials...</div>;

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Real stories of transformation, healing, and positive change from our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <Quote className="w-10 h-10 text-primary-100 mb-6" />
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-8 italic text-lg">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <p className="font-bold text-gray-900 text-lg">
                  {testimonial.clientName}
                </p>
                <p className="text-primary-600 font-medium">
                  {testimonial.tagline}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Ready to Begin Your Healing Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the transformative power of energy healing. Every step you take is a step toward your true nature.
            </p>
            <Link
              href="/book-session"
              className="inline-flex items-center bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 shadow-lg transition-all"
            >
              Book Your Session <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
