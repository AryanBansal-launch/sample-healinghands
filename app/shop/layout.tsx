import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop - Healing Bliss Aura Cleansing Spray | Healing Hands',
  description: 'Purchase Healing Bliss Aromatherapy Aura Cleansing Spray. Helps cleanse surrounding energy and supports calm & positivity. Ideal for home, office & travel.',
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

