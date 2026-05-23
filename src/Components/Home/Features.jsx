import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarHeart,
  HeartPulse,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    title: 'Symptom Checker',
    description: 'Smart symptom analysis to help you understand what needs attention.',
    icon: HeartPulse,
    action: 'Check Symptoms Now',
  },
  {
    title: 'Talk To Me',
    description: 'AI supports anytime for reassurance and quick guidance.',
    icon: Bot,
    action: 'Start Conversation',
  },
  {
    title: 'Daily Health Tips',
    description: 'Fresh pregnancy-friendly insights to keep every day feeling supported.',
    icon: Sparkles,
    action: 'See Daily Tips',
  },
  {
    title: 'Mental Health Support',
    description: 'Emotional care and stress relief designed for your wellbeing.',
    icon: BrainCircuit,
    action: 'Get Support',
  },
  {
    title: 'Emergency Service',
    description: '24/7 urgent healthcare support with fast escalation when needed.',
    icon: ShieldAlert,
    action: 'Get Emergency Help',
  },
  {
    title: 'Weekly Pregnancy Tracker',
    description: 'Follow your pregnancy progress with a clear week-by-week timeline.',
    icon: CalendarHeart,
    action: 'Check Weekly Advice',
  },
]

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#fff4fa] via-white to-[#f8f1ff] px-4 py-8 sm:px-6 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FF5FA2]/12 blur-3xl" />
        <div className="absolute -right-16 top-28 h-80 w-80 rounded-full bg-[#9B5DE5]/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-pink-100/50 blur-3xl" />
      
        <div className="absolute bottom-20 left-10 h-2 w-2 rounded-full bg-pink-300/80 blur-[1px]" />
        <div className="absolute bottom-28 right-16 h-2 w-2 rounded-full bg-purple-300/80 blur-[1px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-pink-200 bg-white/70 px-4 py-1 text-sm font-semibold text-pink-600 shadow-sm backdrop-blur-md">
            Premium Features
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
            Smart Care for Every Mother
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Everything you need for a safe, healthy, and supported motherhood journey.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-4xl border border-white/40 bg-white/60 p-6 shadow-[0_18px_60px_rgba(155,93,229,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-200/80 hover:shadow-[0_26px_70px_rgba(155,93,229,0.14)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-[#FF5FA2]/10 blur-2xl" />
                  <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#9B5DE5]/10 blur-2xl" />
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)] transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                </div>

                {feature.action ? (
                  <div className="relative mt-6">
                    <button className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)] transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(155,93,229,0.24)]">
                      {feature.action}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative mt-6 h-px w-full bg-linear-to-r from-pink-200 via-violet-200 to-transparent" />
                )}
              </article>
            )
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden">
        <svg className="w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="featureWave" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#FF5FA2" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path d="M0,44 C240,100 480,0 720,44 C960,88 1200,24 1440,56 L1440 120 L0 120 Z" fill="url(#featureWave)" />
        </svg>
      </div>
    </section>
  )
}

export default Features