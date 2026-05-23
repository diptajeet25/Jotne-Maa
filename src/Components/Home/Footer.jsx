import { HeartPulse, Mail, MapPin, PhoneCall } from 'lucide-react'

const quickLinks = [
  'Week-wise Advice',
  'Symptom Checker',
  'Mental Health Support',
  'Emergency Service',
]

const supportLinks = [
  'Talk To Me',
  'Weekly Pregnancy Tracker',
  'Daily Health Tips',
  'Secure Login',
]

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: wire this to a backend or email service
  }
  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-[#fff4fa] via-white to-[#f8f1ff] pb-6 pt-16 lg:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-[#FF5FA2]/12 blur-3xl" />
        <div className="absolute -right-20 top-14 h-80 w-80 rounded-full bg-[#9B5DE5]/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-pink-100/50 blur-3xl" />
        <div className="absolute left-16 top-24 text-pink-300/70">❤</div>
        <div className="absolute right-20 top-32 text-purple-300/70">✦</div>
      </div>

      <div className="w-full">
        <div className="grid w-full grid-cols-1 gap-10 rounded-none border-x-0 border border-white/40 bg-white/60 px-4 py-8 shadow-[0_24px_80px_rgba(155,93,229,0.10)] backdrop-blur-xl sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)]">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Jotne Maa</h3>
                <p className="text-sm text-slate-500">Motherhood care made simple, safe, and emotional.</p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              A premium maternity healthcare experience built to guide mothers through pregnancy with expert care, emotional support, and modern smart tools.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-pink-500" />
                <span>support@jotnemaa.com</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="h-4 w-4 text-pink-500" />
                <span>24/7 Emergency Care</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-pink-500" />
                <span>Trusted Motherhood Support, Worldwide</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-4">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF5FA2]">Quick Care</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {quickLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="transition-colors duration-200 hover:text-pink-600">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9B5DE5]">Support</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {supportLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="transition-colors duration-200 hover:text-violet-600">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Stay Connected</h4>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Get gentle updates, weekly care reminders, and emotional wellness tips delivered with care.
            </p>

            <form onSubmit={handleSubmit} className="mt-5">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <div className="flex w-full flex-col gap-3 sm:flex-row lg:flex-col">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-500" />
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    required
                    aria-label="Email address"
                    placeholder="Enter your email"
                    className="w-full rounded-full border border-white/30 bg-white/75 pl-11 pr-4 py-3 text-sm text-slate-700 shadow-sm outline-none backdrop-blur-md placeholder:text-slate-400 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-300/40"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-300/30"
                >
                  Join Wellness Updates
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-500 ">
          <p>© 2026 Jotne Maa. Caring for mothers with emotional, safe, and modern support.</p>
       
        </div>
      </div>


    </footer>
  )
}

export default Footer