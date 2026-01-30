import Link from 'next/link'
import { Sparkles, Instagram, Facebook, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary-900 to-primary-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <span className="font-serif text-xl font-semibold">Healing Hands</span>
            </div>
            <p className="text-primary-100 mb-4 max-w-md">
              Energy Healing, Pranic Healing, Aura Cleansing & Holistic Wellness
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-200 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-200 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-200 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-primary-200 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-primary-200 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-primary-200 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/book-session" className="text-primary-200 hover:text-white transition-colors">
                  Book Session
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/certifications" className="text-primary-200 hover:text-white transition-colors">
                  Certifications
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-primary-200 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <Link href="/contact" className="text-primary-200 hover:text-white transition-colors">
                Contact
              </Link>
            </ul>
          </div>
        </div>

        {/* Hashtags */}
        <div className="mt-8 pt-8 border-t border-primary-700">
          <div className="flex flex-wrap gap-2 text-primary-200 text-sm">
            <span>#HealingHandsEnergy</span>
            <span>#HealWithHealingHands</span>
            <span>#EnergyHealingWorks</span>
            <span>#HealingStartsWithin</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-primary-700 text-center text-primary-200 text-sm">
          <p>&copy; {new Date().getFullYear()} Healing Hands by Preyanka Jain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

