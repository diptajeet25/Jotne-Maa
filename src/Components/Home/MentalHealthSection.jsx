import { Brain, CalendarHeart, HeartHandshake, ShieldAlert, Sparkles } from 'lucide-react'
import wellnessImg from '../../assets/mental-health.png'
const supportCards = [
  {
    title: 'Mood Tracking',
    description: 'Track emotional patterns and notice how you feel throughout pregnancy.',
    icon: Brain,
  },
  {
    title: 'Guided Meditation',
    description: 'Short calming sessions designed to help you breathe, reset, and relax.',
    icon: Sparkles,
    highlighted: true,
  },
  {
    title: 'Stress Relief Tips',
    description: 'Simple daily wellness actions to reduce anxiety and support balance.',
    icon: HeartHandshake,
  },
  {
    title: 'Daily Positive Affirmations',
    description: 'Gentle encouragement and supportive reminders for a lighter mind.',
    icon: CalendarHeart,
  },
]

const MentalHealthSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-b from-[#fff6fb] via-white to-[#f7f1ff] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FF5FA2]/10 blur-3xl" />
        <div className="absolute right-[-5rem] top-16 h-80 w-80 rounded-full bg-[#9B5DE5]/10 blur-3xl" />
        <div className="absolute bottom-6 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-pink-100/50 blur-3xl" />
        <div className="absolute left-12 top-20 text-pink-300/70">❤</div>
        <div className="absolute right-20 top-28 text-purple-300/70">✦</div>
        <div className="absolute bottom-24 right-12 h-2 w-2 rounded-full bg-pink-300/70 blur-[1px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 -z-10 mx-auto hidden max-w-[32rem] rounded-full bg-linear-to-r from-[#FF5FA2]/15 to-[#9B5DE5]/15 blur-3xl lg:block" />

            <div className="relative mx-auto w-full max-w-lg lg:max-w-2xl">
              <div className="absolute -left-3 top-10 hidden rounded-2xl border border-white/20 bg-white/55 p-3 shadow-lg backdrop-blur-md lg:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Wellness</div>
                    <div className="text-sm font-semibold text-slate-900">Breathe & relax</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 bottom-8 hidden rounded-2xl border border-white/20 bg-white/55 p-3 shadow-lg backdrop-blur-md lg:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Support</div>
                    <div className="text-sm font-semibold text-slate-900">Safe emotional care</div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2.25rem] border border-white/40 bg-white/50 p-4 shadow-[0_24px_70px_rgba(155,93,229,0.12)] backdrop-blur-xl sm:p-5">
                <img src={wellnessImg} alt="Pregnant mother relaxing illustration" className="w-full rounded-[1.75rem] object-cover shadow-2xl" />
              </div>

              <div className="absolute -left-2 top-4 h-4 w-4 rounded-full bg-pink-300/70 blur-[1px] lg:-left-8 lg:top-6" />
              <div className="absolute -right-2 top-2 h-6 w-6 rounded-full bg-purple-300/70 blur-[1px] lg:right-4 lg:top-0" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-pink-200 bg-white/70 px-4 py-1 text-sm font-semibold text-pink-600 shadow-sm backdrop-blur-md">
                Emotional Wellness
              </span>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                Because Your Mental Health Matters Too
              </h2>

              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Pregnancy is not only a physical journey — emotional care, peace of mind, and mental wellness are equally important.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {supportCards.map((card) => {
                  const Icon = card.icon

                  return (
                    <article
                      key={card.title}
                      className={[
                        'group rounded-3xl border border-white/40 bg-white/60 p-5 shadow-[0_16px_50px_rgba(155,93,229,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(155,93,229,0.14)]',
                        card.highlighted ? 'ring-1 ring-pink-200/70 shadow-[0_20px_60px_rgba(255,95,162,0.14)]' : '',
                      ].join(' ')}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)] transition-transform duration-300 group-hover:scale-105">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden">
        <svg className="w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wellnessWave" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#FF5FA2" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path d="M0,42 C220,92 470,10 720,42 C960,74 1200,22 1440,52 L1440 120 L0 120 Z" fill="url(#wellnessWave)" />
        </svg>
      </div>
    </section>
  )
}

export default MentalHealthSection