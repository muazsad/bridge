import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Reveal from '../components/Reveal';
import SessionTypeCard from '../components/SessionTypeCard';
import PageGutterAtmosphere from '../components/PageGutterAtmosphere';
import { SESSION_TYPES } from '../constants/sessionTypes';
import { useAuth } from '../context/useAuth';

// ─── Motion config ────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease, delay: d * 0.1 },
  }),
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf3]';

const AVATAR_COLORS = [
  'bg-violet-200 text-violet-800',
  'bg-amber-200 text-amber-800',
  'bg-emerald-200 text-emerald-800',
  'bg-sky-200 text-sky-800',
  'bg-rose-200 text-rose-800',
  'bg-indigo-200 text-indigo-800',
  'bg-teal-200 text-teal-800',
  'bg-orange-200 text-orange-800',
];

function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Static data ─────────────────────────────────────────────────────────────

const STATIC_MENTORS = [
  {
    id: 'static-1',
    name: 'Maya Chen',
    title: 'Director of Product',
    company: 'Lattice',
    bio: 'Spent 9 years navigating B2B SaaS from IC to Director. Happy to help you figure out whether the PM path is what you actually want — and what the first 90 days really look like.',
    expertise: ['Product Strategy', 'Career Pivots', 'B2B SaaS'],
    rating: 4.9,
    years_experience: 9,
    total_sessions: 147,
  },
  {
    id: 'static-2',
    name: 'Jordan Reeves',
    title: 'Sr. Technical Recruiter',
    company: 'Google',
    bio: "Interviewed 1,000+ candidates across FAANG and startups. I'll tell you exactly what tanks résumés, what interviewers actually score, and how to prepare without burning out.",
    expertise: ['Interview Prep', 'Résumé Review', 'FAANG'],
    rating: 4.8,
    years_experience: 7,
    total_sessions: 203,
  },
  {
    id: 'static-3',
    name: 'Elena Voss',
    title: 'UX Lead',
    company: 'Epic Health',
    bio: "Made the RN \u2192 UX jump in 18 months with no CS degree. I specialise in non-linear career switches and portfolios that get past ATS and into real conversations.",
    expertise: ['Career Switch', 'Portfolio Review', 'Healthcare Tech'],
    rating: 5.0,
    years_experience: 6,
    total_sessions: 88,
  },
];

const TESTIMONIALS = [
  {
    quote:
      'I graduated in May with zero connections in tech. Bridge matched me with a Google engineer who rewrote my entire approach to interviews. I had an offer 8 weeks later.',
    name: 'Aditya Sharma',
    role: 'Recent CS grad',
    outcome: 'Landed at Google',
    initials: 'AS',
  },
  {
    quote:
      "I was a high school teacher trying to break into product management. My mentor had made the same exact switch — she told me exactly which skills to lead with and which ones to bury.",
    name: 'Lauren Park',
    role: 'Career switcher, ex-teacher',
    outcome: 'Now a PM at a Series B',
    initials: 'LP',
  },
  {
    quote:
      "As an international student from India, I had no idea how US hiring actually worked — the culture, the follow-up etiquette, the unwritten rules. My mentor walked me through all of it.",
    name: 'Priya Nair',
    role: 'International student, MBA',
    outcome: 'Got promoted in 3 months',
    initials: 'PN',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Explore the platform and browse mentors.',
    features: [
      'Browse all 2,400+ mentors',
      'Save up to 10 favourites',
      'Community access',
      'Read verified session reviews',
    ],
    cta: 'Get started free',
    href: '/register',
    highlight: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For job seekers actively in the hunt.',
    features: [
      '2 sessions per month',
      'Priority booking slots',
      'Session notes + recordings',
      'Direct mentor messaging',
      'Everything in Free',
    ],
    cta: 'Start Pro trial',
    href: '/register?plan=pro',
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Premium',
    price: '$79',
    period: '/mo',
    description: 'Full access, dedicated support.',
    features: [
      'Unlimited sessions',
      'Dedicated advisor match',
      'Same-day emergency slots',
      'LinkedIn profile review',
      'Everything in Pro',
    ],
    cta: 'Go Premium',
    href: '/register?plan=premium',
    highlight: false,
    badge: null,
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSearch({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconCalendar({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconUsers({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconBriefcase({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v4M8 12h8" />
    </svg>
  );
}

function IconCheck({ className = 'h-4 w-4 shrink-0' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconChevronDown({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const HERO_PREVIEW = [
  { name: 'Maya Chen', role: 'Director of Product', co: 'Lattice', grad: 'from-rose-400 to-orange-500' },
  { name: 'Jordan Reeves', role: 'Sr. Recruiter', co: 'Google', grad: 'from-sky-500 to-indigo-500', highlight: true },
  { name: 'Elena Voss', role: 'UX Lead', co: 'Epic Health', grad: 'from-emerald-500 to-teal-600' },
];

function Hero() {
  const { user } = useAuth();

  return (
    <section
      aria-labelledby="landing-heading"
      className="relative scroll-mt-20 overflow-hidden bg-bridge-hero-mesh px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8"
    >
      {/* Grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d6d3d1' stroke-opacity='0.35'%3E%3Cpath d='M36 0v72M0 36h72'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: '72px 72px',
        }}
      />
      {/* Ambient orbs */}
      <div aria-hidden className="pointer-events-none absolute -right-24 top-20 h-[min(520px,80vw)] w-[min(520px,80vw)] rounded-full bg-gradient-to-br from-amber-300/50 via-orange-200/35 to-transparent blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-10 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Left: staggered copy */}
        <motion.div className="lg:col-span-6" variants={stagger} initial="hidden" animate="visible">
          {/* Eyebrow */}
          <motion.div variants={fadeUp} custom={0}>
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-orange-200/80 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-stone-700">
                Career mentorship, booked by the hour
              </span>
            </div>
          </motion.div>

          {/* Headline — "What is this?" */}
          <motion.h1
            id="landing-heading"
            variants={fadeUp}
            custom={1}
            className="font-display text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-stone-900 sm:text-[3.5rem] lg:text-[3.75rem]"
          >
            Real 1-on-1 sessions with{' '}
            <span className="text-gradient-bridge">professionals who&apos;ve been there.</span>
          </motion.h1>

          {/* Sub — "Who is it for?" */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600 sm:text-xl"
          >
            Bridge connects job seekers, career changers, and recent grads with vetted
            professionals for focused, paid mentorship sessions. Real advice — not
            cold LinkedIn messages.
          </motion.p>

          {/* CTAs — "What do I do next?" */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Link
              to="/mentors"
              className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-9 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-500 hover:to-amber-400 hover:shadow-xl ${focusRing}`}
            >
              Browse mentors
            </Link>
            <a
              href="#how-it-works"
              className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-stone-900/12 bg-white/95 px-9 py-4 text-sm font-semibold text-stone-900 shadow-sm backdrop-blur-sm transition hover:border-orange-300/70 hover:shadow-md ${focusRing}`}
            >
              How it works
              <IconChevronDown className="h-4 w-4 opacity-50" />
            </a>
          </motion.div>

          {/* Trust bar */}
          <motion.div variants={fadeUp} custom={4} className="mt-10">
            <div className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-orange-100/80 bg-white/80 px-5 py-3.5 shadow-sm backdrop-blur-sm text-sm">
              {[
                { stat: '2,400+', label: 'vetted mentors' },
                { stat: '85%', label: 'interview success rate' },
                { stat: '4.9\u2605', label: 'average rating' },
              ].map(({ stat, label }, i) => (
                <span key={stat} className="flex items-center gap-1.5">
                  {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-stone-300 sm:inline-block" aria-hidden />}
                  <span className="font-semibold text-stone-900">{stat}</span>
                  <span className="text-stone-500">{label}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: floating UI mockup */}
        <motion.div
          className="relative flex min-h-[380px] items-center justify-center lg:col-span-6 lg:min-h-[480px]"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.35 }}
        >
          {/* Back card */}
          <div className="absolute -left-2 top-4 z-10 hidden w-[88%] sm:block sm:w-[90%]" style={{ transform: 'rotate(-2.5deg)' }}>
            <div className="animate-landing-float rounded-2xl border border-white/90 bg-white/95 p-4 shadow-bridge-glow backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/85" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/85" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/85" />
                  </div>
                  <span className="text-[11px] font-medium text-stone-400">bridge.app/mentors</span>
                </div>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">Saved</span>
              </div>
              {HERO_PREVIEW.map((m) => (
                <div
                  key={m.name}
                  className={`mb-2 flex items-center gap-3 rounded-xl border p-3 last:mb-0 ${
                    m.highlight
                      ? 'border-orange-300/80 bg-gradient-to-r from-orange-50/90 to-amber-50/50 shadow-md ring-2 ring-orange-400/30'
                      : 'border-stone-100 bg-stone-50/50'
                  }`}
                >
                  <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${m.grad} shadow-inner`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-stone-900">{m.name}</p>
                    <p className="truncate text-xs text-stone-500">{m.role} · {m.co}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-bold text-amber-50">
                    Book
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Front card */}
          <div className="relative z-20 mx-auto w-[90%] sm:w-[82%]" style={{ transform: 'rotate(1.5deg)' }}>
            <div className="animate-landing-float-delayed rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-5 shadow-bridge-glow backdrop-blur-md sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-800/80">Session formats</p>
              <p className="mt-2 font-display text-lg font-semibold text-stone-900">Pick how you want the hour</p>
              <div className="mt-4 space-y-2">
                {SESSION_TYPES.slice(0, 3).map((t) => (
                  <div key={t.key} className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50/60 px-3 py-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-700 text-base">
                      {t.icon}
                    </span>
                    <span className="text-sm font-medium text-stone-800">{t.name}</span>
                    <span className="ml-auto text-xs font-semibold text-stone-500">{t.duration}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/mentors"
                className={`mt-5 block w-full rounded-xl bg-stone-900 py-3 text-center text-sm font-semibold text-amber-50 transition hover:bg-stone-800 ${focusRing}`}
              >
                Open directory
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── What is Bridge? ──────────────────────────────────────────────────────────

const EXPLAINER_COLS = [
  {
    icon: IconBriefcase,
    label: 'The mentors',
    title: 'Verified professionals across every industry',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    items: [
      'Engineers at Google, Meta, Amazon',
      'VCs, investors, and founders',
      'Designers at top product agencies',
      'Finance and investment banking professionals',
      'Healthcare and pre-med advisors',
      '50+ other industries represented',
    ],
  },
  {
    icon: IconCalendar,
    label: 'The sessions',
    title: 'Four focused session formats',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-700',
    items: [
      'Career direction and pivots',
      'Interview prep — behavioral and technical',
      'Résumé and LinkedIn review',
      'Networking strategy',
      'Offer negotiation coaching',
      'Portfolio and work sample review',
    ],
  },
  {
    icon: IconUsers,
    label: 'The people who use it',
    title: 'Anyone making a career move',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-700',
    items: [
      'Recent graduates entering the market',
      'Career changers switching industries',
      'International students breaking into the US market',
      'Mid-career professionals seeking promotion',
      'Professionals who want a clear next step',
    ],
  },
];

function WhatIsBridge() {
  return (
    <section className="relative scroll-mt-20 overflow-hidden border-y border-stone-200/60 bg-gradient-to-b from-white to-orange-50/30 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-10 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
            What is Bridge?
          </p>
          <h2 className="font-display text-balance text-3xl font-semibold text-stone-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            The fastest path from where you are to where you want to be.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            Think of it as LinkedIn, but instead of sending cold messages into the void, you book
            a paid, focused hour with someone who&apos;s already done what you&apos;re trying to do.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {EXPLAINER_COLS.map(({ icon: Icon, label, title, bg, iconColor, items }, i) => (
            <Reveal key={label} delay={i * 90}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2, ease } }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white/95 p-7 shadow-bridge-card transition duration-300 hover:border-orange-200/55 hover:shadow-bridge-glow sm:p-8"
              >
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${bg} ${iconColor}`}>
                  <Icon />
                </div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-700/80">{label}</p>
                <h3 className="font-display text-lg font-semibold text-stone-900">{title}</h3>
                <ul className="mt-4 flex-1 space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-snug text-stone-600">
                      <span className="mt-0.5 shrink-0 text-orange-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    n: '01',
    title: 'Browse vetted mentors',
    desc: 'Filter by industry, role, or company. Read their bio, check their background, and find someone whose story rhymes with where you want to go. Every mentor is verified before going live.',
    icon: IconSearch,
    iconBg: 'bg-orange-50 text-orange-700',
  },
  {
    n: '02',
    title: 'Book a session',
    desc: "Pick a format that fits your goal — career advice, interview prep, résumé review, or networking strategy. Choose a time, add context, and you're confirmed. No back-and-forth.",
    icon: IconCalendar,
    iconBg: 'bg-amber-50 text-amber-700',
  },
  {
    n: '03',
    title: 'Get real advice',
    desc: "Show up and ask everything. Sessions end with concrete next steps — not 'let's circle back.' Your mentor has been exactly where you are and knows what actually works.",
    icon: IconUsers,
    iconBg: 'bg-rose-50 text-rose-700',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
            How it works
          </p>
          <h2 className="font-display text-balance text-3xl font-semibold text-stone-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Three steps. No cold DMs required.
          </h2>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {HOW_STEPS.map(({ n, title, desc, icon: Icon, iconBg }, i) => (
            <Reveal key={n} delay={i * 80}>
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2, ease } }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white/95 p-7 shadow-bridge-card transition duration-300 hover:border-orange-200/55 hover:shadow-bridge-glow sm:p-8"
              >
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon />
                  </div>
                  <span className="font-display text-4xl font-semibold leading-none text-orange-200/80 transition group-hover:text-orange-300/95 sm:text-5xl">
                    {n}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-stone-900 sm:text-xl">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-stone-600 sm:text-base">{desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Session Types ────────────────────────────────────────────────────────────

function SessionTypes() {
  return (
    <section
      id="session-types"
      className="relative scroll-mt-20 overflow-hidden border-y border-stone-200/60 bg-gradient-to-b from-orange-50/50 via-amber-50/30 to-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div aria-hidden className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-orange-200/25 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-4 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
            Session formats
          </p>
          <h2 className="font-display text-balance text-3xl font-semibold text-stone-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Four ways to use the hour
          </h2>
        </Reveal>

        <Reveal delay={60} className="mb-10">
          <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Mentors choose which formats they offer. Pick the type that matches what you&apos;re
            working on, then filter by session type when you browse the directory.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SESSION_TYPES.map((type, i) => (
            <Reveal key={type.key} delay={i * 80}>
              <motion.div whileHover={{ y: -4, transition: { duration: 0.2, ease } }}>
                <SessionTypeCard type={type} variant="marketing" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Mentors ─────────────────────────────────────────────────────────

function StaticMentorCard({ mentor }) {
  const color = avatarColor(mentor.name);
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2, ease } }}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white/95 p-6 shadow-bridge-card transition duration-300 hover:border-orange-200/55 hover:shadow-bridge-glow"
    >
      <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400/70 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-bold shadow-md ring-2 ring-white ${color}`}>
          {initials(mentor.name)}
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="truncate font-semibold text-stone-900">{mentor.name}</h3>
          <p className="truncate text-sm text-stone-500">{mentor.title}</p>
          <p className="truncate text-sm font-medium text-amber-800">{mentor.company}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1">
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden>
                <polygon
                  points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
                  fill={i < Math.floor(mentor.rating) ? '#d97706' : '#d4d4d4'}
                />
              </svg>
            ))}
          </span>
          <span className="text-xs font-medium text-stone-500">{mentor.rating.toFixed(1)}</span>
        </span>
        <span className="text-xs text-stone-400">{mentor.years_experience} yrs in</span>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">{mentor.bio}</p>

      <div className="flex flex-wrap gap-1.5">
        {mentor.expertise.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-orange-100 bg-orange-50/80 px-2.5 py-0.5 text-xs font-medium text-orange-900"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-stone-100/90 pt-4">
        <span className="text-xs text-stone-400">{mentor.total_sessions} sessions</span>
        <Link
          to={`/mentors/${mentor.id}`}
          className={`rounded-full bg-gradient-to-r from-stone-900 to-stone-800 px-4 py-2 text-sm font-semibold text-amber-50 shadow-md transition hover:from-stone-800 hover:to-stone-700 ${focusRing}`}
        >
          Open profile
        </Link>
      </div>
    </motion.div>
  );
}

function FeaturedMentors() {
  return (
    <section
      id="featured-mentors"
      className="relative scroll-mt-20 overflow-hidden border-t border-stone-200/60 bg-gradient-to-b from-amber-50/40 via-orange-50/25 to-amber-50/30 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div aria-hidden className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-orange-200/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
              Meet a few mentors
            </p>
            <h2 className="font-display text-balance text-3xl font-semibold text-stone-900 sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
              Real people, real paths
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
              A handful of profiles from the directory. Every mentor is background-verified
              before going live.
            </p>
          </div>
          <Link
            to="/mentors"
            className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 border-stone-900/10 bg-white/95 px-6 py-3 text-sm font-semibold text-stone-900 shadow-md shadow-stone-900/5 transition hover:border-orange-300/70 hover:shadow-lg lg:self-auto ${focusRing}`}
          >
            Browse all mentors →
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STATIC_MENTORS.map((m, i) => (
            <Reveal key={m.id} delay={i * 70} className="h-full">
              <StaticMentorCard mentor={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section
      id="stories"
      className="relative scroll-mt-20 overflow-hidden border-y border-stone-200/60 bg-gradient-to-b from-white to-orange-50/40 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-orange-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
            From real sessions
          </p>
          <h2 className="font-display text-balance text-3xl font-semibold text-stone-900 sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
            What people say afterward
          </h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {TESTIMONIALS.map(({ quote, name, role, outcome, initials: ini }, i) => {
            const color = avatarColor(name);
            return (
              <Reveal key={name} delay={i * 90}>
                <motion.figure
                  whileHover={{ y: -4, transition: { duration: 0.2, ease } }}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white/95 p-7 shadow-bridge-card transition duration-300 sm:p-8 ${
                    i === 1
                      ? 'border-orange-200/90 ring-2 ring-orange-300/40 hover:border-orange-300/80 hover:shadow-bridge-glow lg:z-10 lg:scale-[1.02]'
                      : 'hover:border-orange-200/55 hover:shadow-bridge-glow'
                  }`}
                >
                  <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400/70 to-transparent opacity-0 transition group-hover:opacity-100" />

                  {/* Decorative quote mark */}
                  <span aria-hidden className="mb-3 block font-display text-5xl leading-none text-orange-200/80 select-none">
                    &ldquo;
                  </span>

                  <div className="flex gap-0.5 text-amber-500 -mt-2" aria-label="5 stars">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <span key={s} className="text-sm" aria-hidden>★</span>
                    ))}
                  </div>

                  <blockquote className="mt-3 flex-1 text-pretty">
                    <p className="text-sm leading-relaxed text-stone-700 sm:text-base">
                      {quote}
                    </p>
                  </blockquote>

                  {/* Outcome badge */}
                  <div className="mt-5">
                    <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                      {outcome}
                    </span>
                  </div>

                  <figcaption className="mt-5 flex items-center gap-3 border-t border-stone-100/90 pt-5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm ring-2 ring-white ${color}`}>
                      {ini}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{name}</p>
                      <p className="text-xs text-stone-500">{role}</p>
                    </div>
                  </figcaption>
                </motion.figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Teaser ───────────────────────────────────────────────────────────

function PricingTeaser() {
  const { user } = useAuth();

  return (
    <section
      id="pricing-teaser"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-orange-50/40 to-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div aria-hidden className="pointer-events-none absolute left-1/2 -top-40 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-16 mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
            Pricing
          </p>
          <h2 className="font-display text-balance text-3xl font-semibold text-stone-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            Start free and explore. Upgrade when you&apos;re ready to go deep.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 90}>
              <motion.div
                whileHover={{ y: plan.highlight ? -6 : -4, transition: { duration: 0.2, ease } }}
                className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-7 shadow-bridge-card sm:p-8 ${
                  plan.highlight
                    ? 'border-orange-300/80 bg-gradient-to-b from-orange-50/90 to-white ring-2 ring-orange-400/25'
                    : 'border-stone-200/80 bg-white/95'
                }`}
              >
                {plan.badge && (
                  <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${plan.highlight ? 'text-orange-700' : 'text-stone-500'}`}>
                    {plan.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-semibold text-stone-900">{plan.price}</span>
                    <span className="text-sm text-stone-500">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-500">{plan.description}</p>
                </div>

                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-stone-700">
                      <span className="mt-0.5 text-orange-500">
                        <IconCheck />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    to={user ? '/pricing' : plan.href}
                    className={`block w-full rounded-full py-3.5 text-center text-sm font-semibold transition ${focusRing} ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25 hover:from-orange-500 hover:to-amber-400'
                        : 'border-2 border-stone-900/10 bg-white text-stone-900 hover:border-orange-300/70'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center">
          <Link
            to="/pricing"
            className={`inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition hover:text-orange-700 ${focusRing}`}
          >
            Compare all plan features →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  const { user } = useAuth();

  return (
    <section
      id="get-started"
      aria-labelledby="final-cta-heading"
      className="scroll-mt-20 px-4 pb-24 pt-20 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8"
    >
      <Reveal>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-600 via-amber-500 to-orange-700 px-8 py-16 text-center shadow-bridge-glow ring-1 ring-white/20 sm:px-14 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <div aria-hidden className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-300/20 blur-2xl" />

          <h2
            id="final-cta-heading"
            className="relative font-display text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
          >
            {user
              ? 'Find a mentor whose story rhymes with yours.'
              : 'Start for free. No credit card required.'}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg leading-relaxed text-orange-50/95">
            {user
              ? 'Browse the directory, pick a session format, and book your first hour.'
              : 'Create an account, browse 2,400+ verified mentors, and book a session when you\u2019re ready.'}
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {user ? (
              <Link
                to="/mentors"
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-semibold text-orange-700 shadow-lg transition hover:bg-orange-50 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
              >
                Browse mentors
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-semibold text-orange-700 shadow-lg transition hover:bg-orange-50 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
                >
                  Get started free
                </Link>
                <Link
                  to="/mentors"
                  className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/45 bg-white/5 px-10 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
                >
                  Just show me mentors
                </Link>
              </>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <main id="main-content" aria-label="Bridge — home" className="overflow-x-hidden">
      <PageGutterAtmosphere />
      <Hero />
      <WhatIsBridge />
      <HowItWorks />
      <SessionTypes />
      <FeaturedMentors />
      <Testimonials />
      <PricingTeaser />
      <FinalCTA />
    </main>
  );
}
