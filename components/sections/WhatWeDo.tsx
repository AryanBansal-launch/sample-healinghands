"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function WhatWeDo() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/services", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setServices(data.slice(0, 6)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">What We Do</h2>
          <p className="text-xl text-gray-600">Comprehensive healing for mind, body, and spirit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">{service.shortDescription}</p>
                <Link href={`/services/${service.slug}`} className="text-primary-600 font-semibold flex items-center group">
                  Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
