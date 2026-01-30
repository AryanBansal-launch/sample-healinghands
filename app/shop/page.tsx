'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ShoppingCart, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ShopPage() {
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleBuyNow = () => {
    // In a real app, this would integrate with a payment gateway
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const price = 999 // Replace with actual price
  const whatsappNumber = '919876543210' // Replace with actual number
  const whatsappMessage = encodeURIComponent('Hello! I would like to purchase the Healing Bliss Aura Cleansing Spray.')

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Healing Bliss
          </h1>
          <p className="text-2xl text-gray-600">
            Aromatherapy Aura Cleansing Spray
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-4 md:p-8"
          >
            <div className="aspect-square relative rounded-xl overflow-hidden shadow-inner bg-gray-50">
              <Image
                src="/spray.jpeg"
                alt="Healing Bliss Aura Cleansing Spray"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Price */}
            <div>
              <p className="text-4xl font-bold text-gray-900 mb-2">
                ₹{price.toLocaleString()}
              </p>
              <p className="text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h3>
              <ul className="space-y-3">
                {[
                  'Helps cleanse surrounding energy',
                  'Supports calm & positivity',
                  'Ideal for home, office & travel',
                  'Natural aromatherapy blend',
                  'Non-toxic and safe',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage Instructions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage Instructions</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Shake the bottle gently before use</li>
                <li>Spray 2-3 times in the air around you or your space</li>
                <li>Allow the mist to settle naturally</li>
                <li>Use as needed for energy cleansing</li>
                <li>Store in a cool, dry place</li>
              </ol>
            </div>

            {/* Safety Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Safety Notes</h4>
                  <p className="text-sm text-amber-800">
                    For external use only. Avoid contact with eyes. Keep out of reach of children.
                    If irritation occurs, discontinue use and consult a healthcare professional.
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="font-semibold text-gray-900">Quantity:</label>
              <div className="flex items-center space-x-3 border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleBuyNow}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Buy Now - ₹{(price * quantity).toLocaleString()}</span>
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Talk on WhatsApp</span>
              </a>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-green-800">
                  Thank you! Please contact us on WhatsApp to complete your purchase.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

