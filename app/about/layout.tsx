import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Healing Hands - Preyanka Jain | Energy Healer',
  description: 'Learn about Preyanka Jain, founder of Healing Hands, and her journey in energy healing, pranic healing, and holistic wellness.',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

