'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { parseYouTubeVideoId } from '@/lib/founder-practice-video'

export type FounderPracticeVideoProps = {
  url: string
  mode: 'teaser' | 'full'
  teaserSeconds?: number
  /** Anchor on About for “continue watching” (teaser only). */
  aboutFullHref?: string
  className?: string
}

export default function FounderPracticeVideo({
  url,
  mode,
  teaserSeconds = 45,
  aboutFullHref = '/about#founder-practice-video',
  className = '',
}: FounderPracticeVideoProps) {
  const trimmed = url.trim()
  const [fileTeaserDone, setFileTeaserDone] = useState(false)
  const ytId = trimmed ? parseYouTubeVideoId(trimmed) : null

  const resetFileTeaser = useCallback(() => {
    setFileTeaserDone(false)
  }, [])

  useEffect(() => {
    resetFileTeaser()
  }, [trimmed, mode, teaserSeconds, resetFileTeaser])

  if (!trimmed) return null

  if (ytId) {
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    })
    if (mode === 'teaser') {
      params.set('end', String(Math.max(5, teaserSeconds)))
    }
    const src = `https://www.youtube-nocookie.com/embed/${ytId}?${params.toString()}`
    return (
      <div className={className}>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-black shadow-lg ring-1 ring-black/5">
          <iframe
            title={mode === 'teaser' ? 'Preview: healing practices (short clip)' : 'Healing practices — full message'}
            src={src}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {mode === 'teaser' && (
          <p className="mt-3 text-center text-sm text-gray-600">
            Short preview —{' '}
            <Link href={aboutFullHref} className="font-semibold text-primary-700 underline-offset-2 hover:underline">
              watch the full talk on About
            </Link>
            .
          </p>
        )}
      </div>
    )
  }

  const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (mode !== 'teaser') return
    const el = e.currentTarget
    if (el.currentTime >= teaserSeconds - 0.05) {
      el.pause()
      setFileTeaserDone(true)
    }
  }

  const onSeeking = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (mode !== 'teaser') return
    if (e.currentTarget.currentTime < teaserSeconds - 0.25) {
      setFileTeaserDone(false)
    }
  }

  return (
    <div className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-900 shadow-lg ring-1 ring-black/5">
        <video
          src={trimmed}
          className="h-full w-full object-contain"
          controls
          playsInline
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
          onSeeking={onSeeking}
        />
      </div>
      {mode === 'teaser' && (
        <div className="mt-3 space-y-2 text-center text-sm text-gray-600">
          <p>Preview stops after {Math.round(teaserSeconds)}s — full length on About.</p>
          {fileTeaserDone && (
            <Link
              href={aboutFullHref}
              className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700"
            >
              Watch the full talk on About
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
