import { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import WhatWeDo from '@/components/sections/WhatWeDo'
import FounderTeaser from '@/components/sections/FounderTeaser'
import HowItWorks from '@/components/sections/HowItWorks'
import WhyHealingHands from '@/components/sections/WhyHealingHands'
import TestimonialTeaser from '@/components/sections/TestimonialTeaser'
import PurposePhilosophy from '@/components/sections/PurposePhilosophy'
import FinalCTA from '@/components/sections/FinalCTA'

export const metadata: Metadata = {
  title: 'Healing Hands - Energy Healing for a Calm, Balanced & Happy Life',
  description: 'Remote Pranic Healing • Aura Cleansing • Emotional & Mental Wellness. Experience healing energy for a calm, balanced & happy life.',
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhatWeDo />
      <FounderTeaser />
      <HowItWorks />
      <WhyHealingHands />
      <TestimonialTeaser />
      <PurposePhilosophy />
      <FinalCTA />
    </div>
  )
}

