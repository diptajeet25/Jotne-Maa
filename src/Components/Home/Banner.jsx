import heroImg from '../../assets/banner.png'

const Banner = () => {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-r from-[#fff0f6] via-[#f8f0ff] to-white px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left column - content */}
          <div className="z-10 max-w-2xl text-center lg:max-w-none lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-100/60 px-3 py-1 text-sm font-semibold text-pink-600">Premium Maternity Care</span>

            <h1 className="mt-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              <span>Every Step of Your&nbsp;</span>
              <span className="bg-clip-text text-transparent bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5]">Pregnancy</span>
              <span>, We’re Here for You.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg lg:mx-0">Comprehensive pregnancy care — medical guidance, mental health support, 24/7 emergency help, and weekly progress tracking to keep you and your baby safe and supported.</p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <a id="get-started" href="#get-started" className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-6 py-3 text-white text-base font-semibold shadow-[0_20px_40px_rgba(155,93,229,0.12)] transition-transform duration-200 hover:-translate-y-0.5">Get Started</a>
              <a id="talk-expert" href="#talk-expert" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/60 backdrop-blur-sm px-6 py-3 text-pink-600 text-base font-medium hover:bg-white/70">Talk to Care AI</a>
            </div>

                <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3 lg:mx-0">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-[#FF5FA2]">Weekly Guidance</h3>
                    <p className="text-sm text-slate-600">  Weekly tips, nutrition, and pregnancy insights tailored for you.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-[#9B5DE5]">Talk with Care AI</h3>
                    <p className="text-sm text-slate-600">Instant support to your pregnancy-related questions with AI chatbot.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-[#FF8CC1]">Emergency Response</h3>
                    <p className="text-sm text-slate-600">  Quick SOS help and emergency guidance when needed.</p>
                  </div>
                </div>
          </div>

          {/* Right column - illustration + floating cards */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
              {/* radial glow behind illustration */}
              <div className="absolute -right-6 -top-6 z-0 hidden lg:block">
                <div className="h-72 w-72 rounded-full bg-linear-to-r from-[#FF5FA2]/30 to-[#9B5DE5]/20 blur-3xl" />
              </div>

              <img src={heroImg} alt="Pregnant mother illustration" className="relative z-10 w-full rounded-3xl shadow-2xl" />

              {/* Floating glass cards with subtle float animation */}
              <div className="absolute left-6 top-6 hidden w-44 rounded-xl border border-white/20 bg-white/50 p-3 shadow-lg backdrop-blur-md motion-safe:animate-[float_6s_ease-in-out_infinite] z-20 sm:block">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Week Tracker</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">24 weeks</div>
                  </div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-600">24</div>
                </div>
              </div>

          

              <div className="absolute left-10 bottom-16 hidden w-44 rounded-xl border border-white/20 bg-white/50 p-3 shadow-lg backdrop-blur-md motion-safe:animate-[float_7s_ease-in-out_infinite] z-20 sm:block">
                <div>
                  <div className="text-xs text-slate-500">Mental Health</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">Counseling</div>
                </div>
              </div>

              <div className="absolute right-12 bottom-6 hidden w-40 rounded-xl border border-white/20 bg-white/50 p-3 shadow-lg backdrop-blur-md motion-safe:animate-[float_6s_ease-in-out_infinite] z-20 sm:block">
                <div>
                  <div className="text-xs text-slate-500">Symptom Checker</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">Quick Scan</div>
                </div>
              </div>

              {/* Decorative hearts & particles */}
              <div className="absolute -left-4 -top-4 opacity-90">
                <div className="text-pink-400 text-2xl animate-pulse">❤</div>
              </div>
              <div className="absolute -right-6 -top-10 opacity-80">
                <div className="w-6 h-6 rounded-full bg-purple-300/60 blur-md" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* bottom wave */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 overflow-hidden">
        <svg className="w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#FF5FA2" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <path d="M0,32 C240,96 480,0 720,32 C960,64 1200,16 1440,48 L1440 120 L0 120 Z" fill="url(#g1)" />
        </svg>
      </div>
    </section>
  )
}

export default Banner
