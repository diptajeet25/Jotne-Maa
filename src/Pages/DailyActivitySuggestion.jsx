import Header from '../Components/Header'
import Footer from '../Components/Home/Footer'
import dailyActivityBanner from '../assets/DailyActivity.png'

const icons8 = {
  arrowRight: 'https://img.icons8.com/fluency/48/arrow.png',
  sparkles: 'https://img.icons8.com/fluency/48/sparkles.png',
  heartPulse: 'https://img.icons8.com/fluency/48/heart-with-pulse.png',
  shield: 'https://img.icons8.com/fluency/48/shield.png',
  water: 'https://img.icons8.com/fluency/48/water.png',
  salad: 'https://img.icons8.com/fluency/48/salad.png',
  moon: 'https://img.icons8.com/fluency/48/crescent-moon.png',
  dumbbell: 'https://img.icons8.com/fluency/48/dumbbell.png',
  lotus: 'https://img.icons8.com/fluency/48/meditation-guru.png',
  pills: 'https://img.icons8.com/fluency/48/pill.png',
  bell: 'https://img.icons8.com/?size=100&id=MdmT27TpNlLH&format=png&color=000000',
  feet: 'https://img.icons8.com/fluency/48/feet.png',
  message: 'https://img.icons8.com/fluency/48/message.png',
  warning: 'https://img.icons8.com/fluency/48/warning-shield.png',
  egg: 'https://img.icons8.com/?size=100&id=bmV002nk4gDQ&format=png&color=000000',
  alcohol: 'https://img.icons8.com/fluency/48/wine-glass.png',
  apple: 'https://img.icons8.com/fluency/48/apple.png',
  leaf: 'https://img.icons8.com/fluency/48/leaf.png',
  nuts: 'https://img.icons8.com/?size=100&id=38081&format=png&color=000000',
  wheat: 'https://img.icons8.com/fluency/48/wheat.png',
  milkBottle: 'https://img.icons8.com/fluency/48/milk-bottle.png',
  beans: 'https://img.icons8.com/?size=100&id=W7enEEyoySsv&format=png&color=000000',
  avocado: 'https://img.icons8.com/fluency/48/avocado.png',
  hamburger: 'https://img.icons8.com/fluency/48/hamburger.png',
  candy: 'https://img.icons8.com/fluency/48/candy.png',
  coffee: 'https://img.icons8.com/fluency/48/coffee.png',
  fish: 'https://img.icons8.com/fluency/48/fish.png',
  cigarette: 'https://img.icons8.com/?size=100&id=xAxFFWsxrSE1&format=png&color=000000',
  salt: 'https://img.icons8.com/fluency/48/salt-shaker.png',
  food: 'https://img.icons8.com/?size=100&id=M4uCyiA9v9Dp&format=png&color=000000',
  cloth: 'https://img.icons8.com/?size=100&id=31254&format=png&color=000000',
}

const Icon8 = ({ src, alt, className = '' }) => (
  <img src={src} alt={alt} className={className} />
)

const dailyTips = [
  {
    icon: icons8.water,
    title: 'Stay Hydrated',
    text: 'Drink 8-10 glasses of water to support digestion, blood flow, and amniotic fluid levels.',
    tone: 'from-cyan-400 to-sky-500',
  },
  {
    icon: icons8.food,
    title: 'Eat Healthy',
    text: 'Choose balanced meals with protein, iron, calcium, fiber, and essential vitamins.',
    tone: 'from-emerald-400 to-green-400',
  },
  {
    icon: icons8.moon,
    title: 'Get Enough Rest',
    text: 'Aim for 7-9 hours of sleep so your body can recover and keep energy steady.',
    tone: 'from-violet-400 to-fuchsia-400',
  },
  {
    icon: icons8.dumbbell,
    title: 'Light Exercise',
    text: 'Try walking, prenatal stretching, or gentle yoga to keep your body active and relaxed.',
    tone: 'from-rose-400 to-pink-500',
  },
  {
    icon: icons8.lotus,
    title: 'Manage Stress',
    text: 'Practice breathing, meditation, or quiet time to keep your mind calm and focused.',
    tone: 'from-teal-400 to-cyan-400',
  },
  {
    icon: icons8.pills,
    title: 'Take Supplements',
    text: 'Use folic acid, iron, and calcium only as advised by your doctor.',
    tone: 'from-indigo-400 to-purple-500',
  },
  {
    icon: icons8.bell,
    title: "Don't Hold Urine",
    text: 'Empty your bladder regularly to reduce infection risk and stay comfortable.',
    tone: 'from-cyan-400 to-sky-500',
  },
  {
    icon: icons8.cloth,
    title: 'Wear Comfortable Clothes',
    text: 'Choose loose, breathable clothing and supportive footwear for everyday comfort.',
    tone: 'from-orange-400 to-pink-500',
  },
]

const dietChoice = [
  { label: 'Fruits', value: '', icon: icons8.apple },
  { label: 'Leafy Greens', value: '', icon: icons8.leaf },
  { label: 'Nuts & Seeds', value: '', icon: icons8.nuts },
  { label: 'Eggs', value: '', icon: icons8.egg },
  { label: 'Whole Grains', value: '', icon: icons8.wheat },
  { label: 'Milk & Dairy', value: '', icon: icons8.milkBottle },
  { label: 'Beans & Lentils', value: '', icon: icons8.beans },
  { label: 'Avocado', value: '', icon: icons8.avocado },
]

const avoidList = [
  { label: 'Junk Food', icon: icons8.hamburger },
  { label: 'High Sugar', icon: icons8.candy },
  { label: 'Caffeine (High)', icon: icons8.coffee },
  { label: 'Raw Seafood', icon: icons8.fish },
  { label: 'Unpasteurized Products', icon: icons8.milkBottle },
  { label: 'Alcohol', icon: icons8.alcohol },
  { label: 'Smoking', icon: icons8.cigarette },
  { label: 'Excess Salt', icon: icons8.salt },
]

const DailyActivitySuggestion = () => {
  return (
    <div className="bg-[#fff8fd] text-slate-900">
      <Header />

      <main className="relative isolate overflow-x-hidden px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-168 bg-[radial-gradient(circle_at_top_left,rgba(255,95,162,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(155,93,229,0.18),transparent_32%),linear-gradient(180deg,rgba(255,244,250,1),rgba(255,248,253,0.75))]" />
        <div className="pointer-events-none absolute left-10 top-24 -z-10 h-28 w-28 rounded-full bg-pink-200/30 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute right-10 top-40 -z-10 h-36 w-36 rounded-full bg-violet-200/30 blur-3xl animate-pulse-glow" />

        <section className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[36px] border border-slate-200/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,95,162,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(155,93,229,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))]" />
            <div className="relative grid items-center gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-12">
              <div className="relative max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-pink-600 shadow-sm">
                  <Icon8 src={icons8.sparkles} alt="Sparkles" className="h-4 w-4" />
                  Daily Pregnancy Guidance
                </div>

                <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-[4rem] lg:leading-[0.98]">
                  Practical Health Tips for Every Day
                </h1>

                <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                  Clear, trusted suggestions to help mothers stay hydrated, rested, active, and confident throughout pregnancy.
                </p>

                {/* Primary hero actions removed to simplify interface */}

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { title: 'Doctor Reviewed', text: 'Guidance based on clinical care' },
                    { title: 'Daily Routine', text: 'Easy habits to follow every day' },
                    { title: 'Pregnancy Safe', text: 'Supportive and gentle suggestions' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-pink-200/25 blur-3xl" />
                <div className="absolute -right-4 bottom-10 h-28 w-28 rounded-full bg-violet-200/20 blur-3xl" />
                <div className="relative flex min-h-[360px] w-full max-w-2xl items-center justify-center overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.05)] lg:max-w-[560px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,95,162,0.08),transparent_55%)]" />
                  <div className="relative flex h-full w-full items-center justify-center">
                    <img
                      src={dailyActivityBanner}
                      alt="Daily activity suggestion"
                      className="h-full w-full rounded-[28px] object-cover scale-105"
                    />
                    <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-500">Daily routine</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">Gentle care, every day</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="daily-advice" className="mt-8">
            <h2 className="text-xl font-bold text-slate-900">Daily Health Advice</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dailyTips.map((tip) => (
                <article key={tip.title} className="group rounded-[26px] border border-white/80 bg-white/85 p-5 shadow-[0_14px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(155,93,229,0.1)]">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 ring-1 ring-slate-200 shadow-[0_10px_20px_rgba(15,23,42,0.05)]`}>
                    <Icon8 src={tip.icon} alt={tip.title} className="h-6 w-6 object-contain" />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-slate-900">{tip.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{tip.text}</p>
                 
                </article>
              ))}
            </div>
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm">
              <h3 className="flex items-center gap-3 text-base font-bold text-emerald-700">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white ring-1 ring-emerald-100 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                  <Icon8 src={icons8.heartPulse} alt="Health" className="h-5 w-5 object-contain" />
                </span>
                Eat More (Healthy Choices)
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {dietChoice.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/85 p-3 text-center shadow-sm">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-emerald-100 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                      <Icon8 src={item.icon || icons8.salad} alt={item.label} className="h-5 w-5 object-contain" />
                    </div>
                    <p className="mt-2 text-xs font-bold text-slate-900">{item.label}</p>
                  </div>
                ))}
              </div>
          
            </article>

            <article className="rounded-[28px] border border-rose-100 bg-rose-50/70 p-5 shadow-sm">
              <h3 className="flex items-center gap-3 text-base font-bold text-rose-600">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white ring-1 ring-rose-100 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                  <Icon8 src={icons8.warning} alt="Warning" className="h-5 w-5 object-contain" />
                </span>
                Avoid or Limit
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {avoidList.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/85 p-3 text-center shadow-sm">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-rose-100 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                      <Icon8 src={item.icon || icons8.shield} alt={item.label} className="h-5 w-5 object-contain" />
                    </div>
                    <p className="mt-2 text-[11px] font-bold text-slate-900">{item.label}</p>
                  </div>
                ))}
              </div>
          
            </article>

            {/* More Wellness Tips removed to simplify layout */}
          </section>

          <section className="mt-6 rounded-[26px] border border-white/80 bg-white/80 p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Remember</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Every small step you take today creates a healthier tomorrow for you and your baby.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600">
                <Icon8 src={icons8.sparkles} alt="Sparkles" className="h-4 w-4" />
                Small habits, big care
              </div>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default DailyActivitySuggestion