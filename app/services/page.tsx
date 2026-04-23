"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Shield,
  Gem,
  Activity,
  ArrowRight,
  Heart,
  Users,
  Baby,
  Home,
  Coins,
  Wind,
  Briefcase,
  Scale,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

const iconMap: any = {
  Sparkles,
  Shield,
  Gem,
  Activity,
  Heart,
  Users,
  Baby,
  Home,
  Coins,
  Wind,
  Briefcase,
  Scale,
  Lightbulb,
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="min-h-screen pt-32 text-center">Loading services...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            Healing Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            &quot;All services are complementary wellness practices and are not a substitute for professional medical treatment.&quot;
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 ${
                  service.isProgram ? "border-gold-300 bg-gold-50/30" : ""
                }`}
              >
                <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.shortDescription}
                </p>
                {service.isProgram && (
                  <div className="mb-6 p-4 bg-white rounded-2xl border border-gold-200">
                    <p className="text-sm font-semibold text-gold-700 mb-2">PROSPERITY PROGRAM</p>
                    <p className="text-2xl font-bold text-gray-900">₹{service.programDetails.price}</p>
                    <p className="text-sm text-gray-500">{service.programDetails.sessions} Sessions</p>
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <Link
                    href="/book-session"
                    className="p-3 bg-primary-50 rounded-2xl text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
