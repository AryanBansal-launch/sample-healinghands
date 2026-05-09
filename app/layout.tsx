import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FeaturedBanner from '@/components/FeaturedBanner'
import ChatbaseWidget from '@/components/ChatbaseWidget'
import OrganizationJsonLd from '@/components/OrganizationJsonLd'
import { getSiteUrl } from '@/lib/site-url'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
})

const siteUrl = getSiteUrl()

const defaultTitle = 'The Healing Hands - Energy Healing, Pranic Healing & Aura Cleansing'
const defaultDescription =
  'Remote Pranic Healing, Aura Cleansing, Emotional & Mental Wellness Support. Experience healing energy for a calm, balanced & happy life.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  keywords:
    'energy healing, pranic healing, aura cleansing, remote healing, holistic wellness, emotional healing support',
  icons: {
    icon: [{ url: '/logo.jpeg', type: 'image/jpeg' }],
    shortcut: [{ url: '/logo.jpeg', type: 'image/jpeg' }],
    apple: [{ url: '/logo.jpeg', type: 'image/jpeg' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'The Healing Hands',
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/logo.jpeg',
        width: 512,
        height: 512,
        alt: 'The Healing Hands',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
        <OrganizationJsonLd />
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

