import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Healing Hands',
  description: 'Get in touch with Healing Hands. Contact us via phone, WhatsApp, or email for energy healing services and support.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

