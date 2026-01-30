import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Healing Session | Healing Hands',
  description: 'Schedule your energy healing session online. Choose from remote pranic healing, aura cleansing, emotional wellness support, and more.',
}

export default function BookSessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

