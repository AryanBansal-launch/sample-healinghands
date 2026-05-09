'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import FounderPracticeVideo from '@/components/FounderPracticeVideo'
import { clampTeaserSeconds } from '@/lib/founder-practice-video'

export default function FounderPracticeVideoTeaserSection() {
  const [url, setUrl] = useState('')
  const [teaserSeconds, setTeaserSeconds] = useState(45)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((m: Record<string, string>) => {
        setUrl(m.founderPracticeVideoUrl ?? '')
        setTeaserSeconds(
          clampTeaserSeconds(parseInt(m.founderPracticeVideoTeaserSeconds ?? '45', 10))
        )
      })
      .catch(() => setUrl(''))
      .finally(() => setReady(true))
  }, [])

  if (!ready || !url.trim()) return null

  return (
    <section className="border-y border-primary-100/60 bg-gradient-to-b from-primary-50/40 via-white to-lavender-50/30 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65 }}
          className="text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-800/80">
            From the founder
          </p>
          <h2 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Healing practices, in brief
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            A short introduction to how we hold space for energy-based wellness—gentle, respectful, and
            grounded in real practice.
          </p>
          <div className="mx-auto mt-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-primary-800 shadow-sm">
              <Play className="h-3.5 w-3.5 fill-primary-600 text-primary-600" aria-hidden />
              Preview clip
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="mx-auto mt-10 max-w-3xl"
        >
          <FounderPracticeVideo
            url={url}
            mode="teaser"
            teaserSeconds={teaserSeconds}
            aboutFullHref="/about#founder-practice-video"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          Prefer to read first?{' '}
          <Link href="/about" className="font-semibold text-primary-700 underline-offset-2 hover:underline">
            Visit About
          </Link>
        </motion.p>
      </div>
    </section>
  )
}
