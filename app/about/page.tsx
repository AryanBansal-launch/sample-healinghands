'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Brain,
  Waves,
  Link2,
  Footprints,
  Heart,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

const pillars = [
  {
    icon: Shield,
    title: 'Healing begins with safety',
    body:
      'After stress or difficult experiences, the nervous system often stays on high alert. Real recovery starts when the body and mind sense safety—through steady presence, breath, and a compassionate space—not pressure to “look fine.”',
    accent: 'from-teal-50 to-slate-50 border-teal-100/80',
    iconClass: 'text-teal-600 bg-teal-100',
  },
  {
    icon: Waves,
    title: 'Regulation, not suppression',
    body:
      'Feelings that are acknowledged can move and settle. What stays buried often keeps the inner alarm ringing. Practices that support emotional regulation help the calmer, wiser parts of you come back online.',
    accent: 'from-sky-50 to-lavender-50 border-sky-100/80',
    iconClass: 'text-sky-600 bg-sky-100',
  },
  {
    icon: Link2,
    title: 'Integration is the goal',
    body:
      'Healing reconnects story, emotion, and body into something more whole. Every part of your experience—grief, anger, fear, hope—deserves a place in that picture.',
    accent: 'from-rose-50/80 to-amber-50/50 border-rose-100/70',
    iconClass: 'text-rose-600 bg-rose-100',
  },
  {
    icon: Footprints,
    title: 'Embodied awareness',
    body:
      'The body holds what words alone cannot always release. Breath, gentle movement, and mindful attention help stored tension soften so balance can return.',
    accent: 'from-primary-50 to-emerald-50/80 border-primary-100/80',
    iconClass: 'text-primary-700 bg-primary-100',
  },
] as const

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[42vh] md:min-h-[48vh] w-full overflow-hidden">
        <Image
          src="/banners/banner4.jpeg"
          alt="Calming wellness imagery for The Healing Hands"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-slate-900/55 to-primary-900/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="relative z-10 flex min-h-[42vh] md:min-h-[48vh] items-center justify-center px-4 py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-center text-white"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
              The Healing Hands
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              About our practice
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/90 md:text-xl">
              A journey of healing, compassion, and transformation—rooted in energy work and
              holistic care that honors how mind, body, and spirit move together.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-20">
        {/* Intro */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-3xl text-center text-lg leading-relaxed text-gray-600 md:text-xl"
        >
          We believe clarity and peace grow in spaces where you are seen—not rushed past your
          feelings. The ideas below mirror the educational piece we share with our community
          (your banner in our library) on how emotional recovery differs from forced positivity.
        </motion.p>

        {/* Featured: narrative first, then full-width infographic (natural aspect — no column squeeze) */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.65 }}
          className="mb-24 space-y-12"
        >
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-200/30 backdrop-blur-sm md:p-10 lg:p-12">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-teal-200/60 bg-teal-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              From our library
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              The science of healing
            </h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">
              How recovery differs from “just stay positive”
            </p>
            <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
              The brain tends to heal through{' '}
              <strong className="font-semibold text-gray-800">safety, presence,</strong> and{' '}
              <strong className="font-semibold text-gray-800">emotional integration</strong>—not
              through being told to cheer up. When pain is dismissed, we can feel unseen; when we
              are met with patience, the whole system can begin to settle.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
              That perspective shapes how we hold space in sessions: gentle, respectful, and
              oriented toward balance rather than performance. Our services are{' '}
              <span className="font-medium text-gray-800">complementary wellness practices</span>{' '}
              and are not a substitute for professional medical or mental health care.
            </p>
            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 md:p-6">
              <p className="text-sm font-semibold text-slate-700">Toxic positivity vs. real space</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Phrases like “just think positive” or “good vibes only” can silence what is true
                inside you. A healthier stance sounds more like:{' '}
                <em className="text-slate-800 not-italic">
                  “I am open to feeling okay again, one step at a time.”
                </em>{' '}
                That openness creates room for genuine healing.
              </p>
            </div>
            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700 hover:shadow-lg"
            >
              View healing services
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-b from-stone-100 via-amber-50/15 to-teal-50/50 p-2 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] ring-1 ring-stone-200/70 sm:p-3 md:rounded-3xl md:p-4">
            <Image
              src="/info/healing.jpeg"
              alt="Infographic: The science of healing—how the brain recovers from trauma, and why toxic positivity can block genuine recovery"
              width={1205}
              height={832}
              className="h-auto w-full rounded-lg md:rounded-2xl"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        </motion.section>

        {/* Pillars */}
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            Ideas that guide our work
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            These pillars echo the themes in the piece above—and how we approach sessions at The
            Healing Hands.
          </p>
        </motion.div>
        <div className="mb-24 grid gap-6 sm:grid-cols-2">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              {...fadeUp}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className={`rounded-2xl border bg-gradient-to-br p-6 shadow-sm md:p-8 ${pillar.accent}`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${pillar.iconClass}`}
              >
                <pillar.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">{pillar.body}</p>
            </motion.article>
          ))}
        </div>

        {/* Pull quote */}
        <motion.figure
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="mb-24 rounded-3xl border border-primary-200/60 bg-gradient-to-br from-primary-50 via-white to-lavender-50/60 px-8 py-10 text-center shadow-inner md:px-14 md:py-12"
        >
          <Brain className="mx-auto mb-4 h-10 w-10 text-primary-600/80" aria-hidden />
          <blockquote className="font-serif text-xl font-medium leading-relaxed text-gray-800 md:text-2xl text-balance">
            Healing isn&apos;t about thinking yourself happy—it&apos;s about helping the mind and
            body rediscover balance, often in quiet moments and gentle self-acceptance.
          </blockquote>
        </motion.figure>

        {/* Founder */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.65 }}
          className="mb-20 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl"
        >
          <div className="grid gap-10 p-8 md:grid-cols-[minmax(0,300px)_1fr] md:items-start md:gap-12 md:p-12 lg:p-14">
            <div className="mx-auto flex w-full max-w-[300px] flex-col items-center md:mx-0">
              <div className="w-full overflow-hidden rounded-3xl border-4 border-primary-100 bg-gradient-to-b from-stone-100 to-primary-50/30 shadow-lg ring-1 ring-stone-200/60">
                <Image
                  src="/founder/preyanka-m-jain.jpeg"
                  alt="Preyanka M Jain, founder of The Healing Hands"
                  width={737}
                  height={1599}
                  className="h-auto w-full object-contain object-center"
                  sizes="(max-width: 768px) 90vw, 300px"
                />
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                {['Pranic Healer', 'Counselor', 'Yoga Trainer', 'Astrologer'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                Preyanka M Jain
              </h2>
              <p className="mt-2 text-lg font-semibold text-primary-600">Founder & Energy Healer</p>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Welcome to The Healing Hands. My name is Preyanka M Jain, and I am honored to
                  share my healing journey with you. What began as a personal calling has grown
                  into a commitment to support others toward wellness and balance.
                </p>
                <p>
                  My path into energy healing began with curiosity about the subtle forces that
                  shape how we feel. Over years of study and practice, I have trained in modalities
                  including Pranic Healing, crystal and angel work, divine healing, and more.
                </p>
                <p>
                  As a certified counselor and yoga trainer, I work with the whole person—mind,
                  body, and spirit. Astrology and numerology can add another layer of insight into
                  your unique energetic blueprint when that feels right for you.
                </p>
                <p>
                  The Healing Hands exists because I believe everyone deserves peace, clarity, and
                  emotional steadiness. Healing is deeply personal; I take time to understand your
                  needs rather than offering a one-size template.
                </p>
              </div>
              <div className="mt-10 flex flex-col gap-3 rounded-2xl border-l-4 border-primary-500 bg-primary-50/60 p-6 md:flex-row md:items-center md:justify-between md:gap-6">
                <p className="font-serif text-lg italic leading-relaxed text-gray-700">
                  &quot;Healing starts from within. When we clear the energy, we create space for
                  peace, clarity, and transformation.&quot;
                </p>
                <div className="flex shrink-0 items-center gap-2 text-primary-700">
                  <Heart className="h-5 w-5 fill-primary-200 text-primary-600" aria-hidden />
                  <span className="text-sm font-semibold">— Preyanka M Jain</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.55 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/book-session"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700 hover:shadow-xl sm:w-auto"
          >
            Book a healing session
          </Link>
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-gray-300 bg-white px-10 py-4 text-lg font-semibold text-gray-800 transition hover:border-primary-300 hover:bg-primary-50/50 sm:w-auto"
          >
            Ask a question
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
