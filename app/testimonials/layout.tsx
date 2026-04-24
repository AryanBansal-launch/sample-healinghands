import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Testimonials | The Healing Hands',
  description: 'Read real client experiences and testimonials about energy healing, pranic healing, and holistic wellness services at The Healing Hands.',
}

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

