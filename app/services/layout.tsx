import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Healing Services - Pranic Healing, Aura Cleansing & Wellness | Healing Hands',
  description: 'Comprehensive energy healing services including remote pranic healing, aura cleansing, emotional wellness support, stress relief, and space energy cleansing.',
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

