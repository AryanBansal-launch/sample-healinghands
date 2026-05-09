'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Award, ChevronLeft, ChevronRight, FileText, X } from 'lucide-react'

type Cert = { _id: string; title: string; description?: string; certificateImage: string }

function isRemote(src: string) {
  return src.startsWith('http://') || src.startsWith('https://')
}

const AUTO_MS = 5200

export default function AboutCredentialsPeek() {
  const reduceMotion = useReducedMotion()
  const [certs, setCerts] = useState<Cert[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [modalCert, setModalCert] = useState<Cert | null>(null)

  useEffect(() => {
    fetch('/api/certifications')
      .then((r) => r.json())
      .then((data: unknown) => {
        setCerts(Array.isArray(data) ? (data as Cert[]) : [])
      })
      .catch(() => setCerts([]))
      .finally(() => setLoading(false))
  }, [])

  const step = useCallback((delta: number) => {
    setIndex((i) => {
      const n = certs.length
      if (n === 0) return 0
      return (((i + delta) % n) + n) % n
    })
  }, [certs.length])

  useEffect(() => {
    if (certs.length <= 1 || reduceMotion) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % certs.length)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [certs.length, reduceMotion])

  useEffect(() => {
    const max = Math.max(0, certs.length - 1)
    setIndex((i) => Math.min(Math.max(0, i), max))
  }, [certs.length])

  useEffect(() => {
    if (!modalCert) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalCert(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalCert])

  useEffect(() => {
    if (modalCert) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalCert])

  if (loading) {
    return (
      <div
        className="mx-auto mt-8 w-full max-w-4xl rounded-[1.75rem] bg-gradient-to-br from-primary-200/70 via-gold-100/60 to-lavender-200/60 p-[1px] shadow-lg shadow-primary-900/10"
        aria-hidden
      >
        <div className="overflow-hidden rounded-[1.7rem] bg-gradient-to-b from-white to-stone-50/90">
          <div className="h-10 animate-pulse bg-gradient-to-r from-primary-50/80 to-lavender-50/80" />
          <div className="p-4 sm:p-5">
            <div className="min-h-[260px] w-full animate-pulse rounded-2xl border border-stone-200/60 bg-gradient-to-br from-stone-100 to-stone-50 md:min-h-[380px]" />
          </div>
          <div className="flex justify-center gap-1.5 pb-4">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-5 rounded-full bg-stone-200/90" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (certs.length === 0) return null

  const current = certs[index]
  const showArrows = certs.length > 1

  return (
    <>
      <div
        className="mx-auto mt-8 w-full max-w-4xl"
        aria-roledescription="carousel"
        aria-label="Training documents"
      >
        <div className="rounded-[1.75rem] bg-gradient-to-br from-primary-300/80 via-gold-200/70 to-lavender-300/75 p-[1px] shadow-xl shadow-primary-900/15 ring-1 ring-white/60">
          <div className="relative overflow-hidden rounded-[1.7rem] bg-gradient-to-b from-white via-stone-50/50 to-primary-50/25">
            <div className="relative flex items-center justify-center gap-2 border-b border-primary-100/60 bg-gradient-to-r from-primary-50/90 via-white/80 to-lavender-50/70 px-4 py-3 sm:px-5">
              <Award className="h-4 w-4 shrink-0 text-primary-600 sm:h-[1.15rem] sm:w-[1.15rem]" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-900/75 sm:text-xs">
                Training record
              </span>
              <span className="mx-1 hidden h-4 w-px bg-primary-200/80 sm:block" aria-hidden />
              {certs.length > 1 ? (
                <span className="text-xs tabular-nums text-gray-500">
                  {index + 1} <span className="text-gray-400">/</span> {certs.length}
                </span>
              ) : (
                <span className="text-xs text-gray-500">Official document</span>
              )}
            </div>

            <div className="relative px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
              <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-b from-white to-stone-50/95 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_40px_-18px_rgba(20,83,45,0.12)] ring-1 ring-stone-100/80 sm:p-2">
                <button
                  type="button"
                  className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl text-left outline-none ring-primary-400/0 transition-[box-shadow,transform] duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.99]"
                  onClick={() => setModalCert(current)}
                  aria-label={`View document: ${current.title}`}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-primary-900/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative mx-auto h-[min(72vh,440px)] w-full max-h-[560px] min-h-[280px] sm:h-[min(70vh,480px)] sm:min-h-[320px] md:h-[min(68vh,520px)] md:min-h-[380px]">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        key={current._id}
                        initial={reduceMotion ? false : { opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, x: -14 }}
                        transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                        className="absolute inset-2 sm:inset-3 md:inset-4"
                      >
                        <Image
                          src={current.certificateImage}
                          alt={current.title}
                          fill
                          className="object-contain object-center drop-shadow-sm transition duration-300 group-hover:drop-shadow-md"
                          sizes="(max-width: 768px) 100vw, 56rem"
                          unoptimized={isRemote(current.certificateImage)}
                          priority={index === 0}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-gray-900/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:text-[11px]">
                    Click to enlarge
                  </span>
                </button>
              </div>

              {showArrows && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      step(-1)
                    }}
                    className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary-100 bg-white text-primary-800 shadow-lg shadow-primary-900/10 ring-1 ring-white transition hover:border-primary-200 hover:bg-primary-50/90 hover:text-primary-900 sm:left-1"
                    aria-label="Previous document"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      step(1)
                    }}
                    className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary-100 bg-white text-primary-800 shadow-lg shadow-primary-900/10 ring-1 ring-white transition hover:border-primary-200 hover:bg-primary-50/90 hover:text-primary-900 sm:right-1"
                    aria-label="Next document"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-700/80">
            Current document
          </p>
          <div className="mx-auto mt-2 h-px w-14 bg-gradient-to-r from-transparent via-primary-400/70 to-transparent" />
          <p className="mx-auto mt-3 max-w-2xl text-balance font-serif text-lg font-semibold leading-snug text-gray-900 md:text-xl">
            {current.title}
          </p>
        </div>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setModalCert(current)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 ring-2 ring-primary-500/20 transition hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30"
          >
            <FileText className="h-4 w-4 opacity-95" aria-hidden />
            View document
          </button>
        </div>

        {certs.length > 1 && (
          <div className="mt-5 flex justify-center gap-2">
            {certs.map((c, i) => (
              <button
                key={c._id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-8 bg-primary-600 shadow-sm shadow-primary-600/40 ring-2 ring-primary-200/80'
                    : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Show document ${i + 1} of ${certs.length}`}
                aria-current={i === index}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalCert && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="credential-modal-title"
            onClick={() => setModalCert(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xl shadow-primary-900/20 ring-1 ring-white/80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 bg-gradient-to-r from-primary-500 via-gold-400 to-lavender-500" aria-hidden />
              <button
                type="button"
                onClick={() => setModalCert(null)}
                className="absolute right-3 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200/90 bg-white/95 text-gray-800 shadow-md backdrop-blur-sm transition hover:border-primary-200 hover:bg-primary-50/80 hover:text-primary-900"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
              <div className="max-h-[92vh] overflow-y-auto">
                <div className="w-full bg-gradient-to-b from-stone-100/90 to-stone-50 p-4 sm:p-8">
                  <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200/70 bg-white p-2 shadow-inner ring-1 ring-stone-100 sm:p-3">
                    <div className="relative mx-auto h-[min(58vh,440px)] w-full min-h-[240px] sm:h-[min(60vh,500px)] sm:min-h-[300px]">
                      <Image
                        src={modalCert.certificateImage}
                        alt=""
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 896px) 100vw, 896px"
                        unoptimized={isRemote(modalCert.certificateImage)}
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t border-stone-100 bg-gradient-to-b from-white to-primary-50/20 p-6 sm:p-8">
                  <h2
                    id="credential-modal-title"
                    className="pr-12 font-serif text-2xl font-bold leading-tight text-gray-900 sm:text-3xl"
                  >
                    {modalCert.title}
                  </h2>
                  {(modalCert.description ?? '').trim() ? (
                    <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                      {(modalCert.description ?? '').trim()}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
