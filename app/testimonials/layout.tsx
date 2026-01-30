import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Testimonials | Healing Hands',
  description: 'Read real client experiences and testimonials about energy healing, pranic healing, and holistic wellness services at Healing Hands.',
}

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

