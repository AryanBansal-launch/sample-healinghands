import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Testimonials | The Healing Hands',
  description:
    'Read client testimonials and share your own experience with The Healing Hands—energy healing, pranic healing, and holistic wellness.',
}

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

