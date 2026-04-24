'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/shop', label: 'Shop' },
  { href: '/book-session', label: 'Book Session' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const shellClass = [
    'pointer-events-auto w-full max-w-6xl mx-auto',
    'rounded-2xl sm:rounded-3xl md:rounded-full',
    'border transition-all duration-300 ease-out',
    'backdrop-blur-xl backdrop-saturate-150',
    'shadow-lg',
    isScrolled
      ? 'bg-white/90 border-primary-100/70 shadow-xl shadow-primary-900/10 ring-1 ring-white/80'
      : 'bg-white/65 border-white/80 shadow-primary-900/5 ring-1 ring-white/60',
  ].join(' ')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-3 pt-3 sm:px-5 sm:pt-4 pointer-events-none">
      <motion.nav
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className={shellClass}
        aria-label="Main navigation"
      >
        <div className="flex h-14 w-full items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-5 md:px-6">
          <Link
            href="/"
            className="flex min-w-0 max-w-[min(100%,calc(100%-3rem))] shrink items-center gap-2.5 sm:max-w-none sm:gap-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary-100/80 bg-white shadow-inner ring-2 ring-white sm:h-11 sm:w-11">
              <Image
                src="/logo.jpeg"
                alt="The Healing Hands logo"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="44px"
              />
            </div>
            <span className="truncate font-serif text-lg font-semibold tracking-tight text-gray-900 sm:text-xl md:text-2xl">
              The Healing Hands
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto px-1 md:flex lg:gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-full px-2.5 py-2 text-[13px] font-medium text-gray-600 transition-colors hover:bg-primary-50/90 hover:text-primary-800 lg:px-3.5 lg:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-primary-50/80 hover:text-primary-800 md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            className="pointer-events-auto mt-2 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/70 bg-white/92 shadow-xl shadow-primary-900/10 backdrop-blur-xl md:hidden"
          >
            <nav className="max-h-[min(70vh,28rem)] overflow-y-auto px-2 py-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-[15px] font-medium text-gray-700 transition-colors hover:bg-primary-50/90 hover:text-primary-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
