"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award } from "lucide-react";
import Image from "next/image";

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  useEffect(() => {
    fetch("/api/certifications")
      .then((res) => res.json())
      .then((data) => {
        setCertifications(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="min-h-screen pt-32 text-center text-gray-600">Loading certifications...</div>;

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
            Certifications & Credentials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted expertise backed by professional training and certifications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100"
            >
              <div className="aspect-video relative rounded-xl mb-4 overflow-hidden bg-gray-50 border border-gray-100 group-hover:scale-[1.02] transition-transform">
                <Image
                  src={cert.certificateImage}
                  alt={cert.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {cert.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {cert.description}
              </p>
              <p className="text-primary-600 text-sm font-medium mt-4 group-hover:underline">
                View Certificate →
              </p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedCert && (
            <div 
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden relative shadow-2xl"
              >
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>
                <div className="flex flex-col">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={selectedCert.certificateImage}
                      alt={selectedCert.title}
                      fill
                      className="object-contain bg-gray-50"
                    />
                  </div>
                  <div className="p-8">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                      {selectedCert.title}
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {selectedCert.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
