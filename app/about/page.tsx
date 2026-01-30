'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div className="relative h-[40vh] w-full">
        <Image
          src="/banner4.jpeg"
          alt="Healing Hands About Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
              About Healing Hands
            </h1>
            <p className="text-xl md:text-2xl font-light">
              A journey of healing, compassion, and transformation
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Founder Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl flex-shrink-0 relative border-4 border-primary-50">
              <Image
                src="/banner2.jpeg"
                alt="Preyanka Jain"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Preyanka Jain
              </h2>
              <p className="text-xl text-primary-600 font-semibold mb-4">
                Founder & Energy Healer
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {[
                  'Pranic Healer',
                  'Counselor',
                  'Yoga Trainer',
                  'Astrologer',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full border border-primary-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>
              Welcome to Healing Hands. My name is Preyanka Jain, and I am honored to share my healing
              journey with you. What began as a personal calling has evolved into a deep commitment to
              supporting others on their path to wellness and balance.
            </p>
            <p>
              My journey into energy healing started from a place of genuine curiosity and a desire to
              understand the subtle energies that influence our well-being. Through years of dedicated
              study and practice, I have trained in multiple healing modalities including Pranic Healing,
              Crystal Healing, Angel Healing, Divine Healing, and more.
            </p>
            <p>
              As a certified counselor and yoga trainer, I bring a holistic approach to healing that
              recognizes the interconnectedness of mind, body, and spirit. My practice also includes
              astrology and numerology, which allows me to offer deeper insights into your unique
              energetic blueprint.
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">My Purpose & Calling</h3>
            <p>
              Healing Hands was born from a simple yet profound belief: everyone deserves to experience
              peace, clarity, and emotional balance. I have witnessed the transformative power of energy
              healing in my own life and in the lives of those I've had the privilege to serve.
            </p>
            <p>
              My approach is rooted in compassion, non-judgment, and respect for each individual's unique
              healing journey. I understand that healing is not a one-size-fits-all process, which is why
              I take time to understand your specific needs and concerns.
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">A Message of Hope & Balance</h3>
            <p>
              If you're reading this, you may be seeking support, clarity, or a sense of peace. Know that
              you are not alone. Whether you're dealing with stress, emotional challenges, relationship
              issues, or simply seeking to enhance your overall well-being, I am here to support you.
            </p>
            <p>
              Healing is a journey, not a destination. Together, we can work toward restoring balance,
              clearing energetic blockages, and helping you feel lighter, calmer, and more aligned with
              your true self.
            </p>
            <div className="bg-gradient-to-br from-primary-50 to-lavender-50 rounded-xl p-6 mt-8 border-l-4 border-primary-600 shadow-sm">
              <p className="text-lg italic text-gray-700">
                &quot;Healing starts from within. When we clear the energy, we create space for peace,
                clarity, and transformation.&quot;
              </p>
              <p className="text-right mt-4 font-semibold text-primary-700">— Preyanka Jain</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <a
            href="/book-session"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Book a Healing Session
          </a>
        </motion.div>
      </div>
    </div>
  )
}
