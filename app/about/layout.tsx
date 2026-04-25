import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About The Healing Hands - Preyanka M Jain | Energy Healer',
  description:
    'Learn about Preyanka M Jain, founder of The Healing Hands—energy healing, pranic healing, and a holistic philosophy grounded in safety, integration, and embodied wellness.',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

