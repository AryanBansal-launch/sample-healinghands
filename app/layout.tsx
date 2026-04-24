import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FeaturedBanner from '@/components/FeaturedBanner'
import ChatbaseWidget from '@/components/ChatbaseWidget'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'The Healing Hands - Energy Healing, Pranic Healing & Aura Cleansing',
  description: 'Remote Pranic Healing, Aura Cleansing, Emotional & Mental Wellness Support. Experience healing energy for a calm, balanced & happy life.',
  keywords: 'energy healing, pranic healing, aura cleansing, remote healing, holistic wellness, emotional healing support',
  icons: {
    icon: [{ url: '/logo.jpeg', type: 'image/jpeg' }],
    shortcut: [{ url: '/logo.jpeg', type: 'image/jpeg' }],
    apple: [{ url: '/logo.jpeg', type: 'image/jpeg' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen">
        <Navbar />
        <main className="pt-24 sm:pt-[5.75rem]">
          <FeaturedBanner />
          {children}
        </main>
        <Footer />
        <ChatbaseWidget />
      </body>
    </html>
  )
}

