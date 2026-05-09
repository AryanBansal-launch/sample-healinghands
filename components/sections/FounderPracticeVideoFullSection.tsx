'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FounderPracticeVideo from '@/components/FounderPracticeVideo'

export default function FounderPracticeVideoFullSection() {
  const [url, setUrl] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((m: Record<string, string>) => {
        setUrl(m.founderPracticeVideoUrl ?? '')
      })
      .catch(() => setUrl(''))
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded || !url.trim()) return null

  return (
    <motion.section
      id="founder-practice-video"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65 }}
      className="mb-20 scroll-mt-28 rounded-3xl border border-primary-100/70 bg-gradient-to-br from-white via-primary-50/25 to-lavender-50/40 p-8 shadow-lg shadow-primary-900/5 md:p-10"
      aria-labelledby="founder-practice-video-heading"
    >
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary-800/80">
        From the founder
      </p>
      <h2
        id="founder-practice-video-heading"
        className="mt-2 text-center font-serif text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl"
      >
        Healing practices — full message
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-gray-600 md:text-lg">
        The same welcome you saw on the home preview—here in full whenever you&apos;re ready to sit with
        it.
      </p>
      <div className="mx-auto mt-8 max-w-4xl">
        <FounderPracticeVideo url={url} mode="full" />
      </div>
    </motion.section>
  )
}
