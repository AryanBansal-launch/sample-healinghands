"use client";

import { ServiceDetailSkeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Shield, Gem, Activity, Heart, Users, Baby, Home, 
  Coins, Wind, Briefcase, Scale, Lightbulb, ArrowLeft, Calendar, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const iconMap: any = {
  Sparkles, Shield, Gem, Activity, Heart, Users, Baby, Home, 
  Coins, Wind, Briefcase, Scale, Lightbulb
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services/${slug}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [slug]);

  if (loading) return <ServiceDetailSkeleton />;

  if (!service || service.error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Service Not Found</h2>
      <Link href="/services" className="text-primary-600 font-bold flex items-center hover:underline">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Services
      </Link>
    </div>
  );

  const Icon = iconMap[service.icon] || Sparkles;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] bg-primary-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950 opacity-90" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Icon className="w-96 h-96 absolute -bottom-20 -right-20 text-white" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md p-4 rounded-3xl mb-8"
          >
            <Icon className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6"
          >
            {service.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-primary-100 max-w-2xl mx-auto"
          >
            {service.shortDescription}
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">About this Service</h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                {service.fullDescription.split('\n').map((para: string, i: number) => (
                  <p key={i} className="mb-4 leading-relaxed">{para}</p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-3xl border border-gray-100"
            >
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Key Benefits</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start space-x-3 text-gray-700">
                    <CheckCircle2 className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-2xl">
              <p className="text-sm text-yellow-800 leading-relaxed italic">
                <strong>Disclaimer:</strong> This energy healing service is a complementary wellness practice and is not a substitute for professional medical treatment, diagnosis, or advice.
              </p>
            </div>
          </div>

          {/* Sidebar / CTA */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sticky top-32 space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
                {service.isProgram ? (
                  <div className="mb-8 p-6 bg-gold-50 rounded-2xl border border-gold-100">
                    <p className="text-sm font-bold text-gold-700 uppercase tracking-widest mb-2">Exclusive Program</p>
                    <div className="text-4xl font-bold text-gray-900 mb-1">₹{service.programDetails.price}</div>
                    <p className="text-gray-600">{service.programDetails.sessions} Personalized Sessions</p>
                  </div>
                ) : (
                  <div className="mb-8">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Ready to Heal?</h3>
                    <p className="text-gray-600">Start your journey toward wellness today.</p>
                  </div>
                )}
                
                <Link
                  href="/book-session"
                  className="w-full bg-primary-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-700 hover:shadow-primary-200 transition-all flex items-center justify-center space-x-3"
                >
                  <Calendar className="w-6 h-6" />
                  <span>Book Session</span>
                </Link>
                <Link
                  href="/services"
                  className="w-full mt-4 text-gray-500 font-semibold py-3 flex items-center justify-center hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> All Services
                </Link>
              </div>
              
              <div className="bg-primary-50 p-8 rounded-3xl text-center">
                <p className="text-primary-800 font-medium mb-4 italic">
                  &quot;Healing is a journey of returning to yourself.&quot;
                </p>
                <div className="w-12 h-0.5 bg-primary-200 mx-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
