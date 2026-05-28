import emergencyLogo from '../assets/emergencyLogo.png'
import emergencyImage from '../assets/emergency.png'

const EmergencyBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50 via-white to-sky-50 px-6 py-6 shadow-[0_18px_50px_rgba(244,63,94,0.10)] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute right-0 top-6 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl" />
      </div>

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="space-y-5 text-center lg:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-100 bg-white shadow-lg shadow-rose-100/80">
              <img
                src={emergencyLogo}
                alt="Emergency logo"
                className="h-11 w-11 object-contain"
              />
            </div>

            <div>
              <p className="text-3xl font-extrabold tracking-tight text-rose-600 sm:text-4xl">
                Emergency Services
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">
                Quick help. Near you. Always for you.
              </p>
            </div>
          </div>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-700 sm:text-base lg:mx-0">
            Select your district to find nearest ambulances and gynecologists
            available 24/7 for emergency care.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-rose-100">
              24/7 Support
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-600 shadow-sm ring-1 ring-sky-100">
              Ambulance & Gynecology
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-600 shadow-sm ring-1 ring-emerald-100">
              Fast District Search
            </div>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute inset-x-8 bottom-2 h-20 rounded-full bg-rose-200/35 blur-2xl" />
          <img
            src={emergencyImage}
            alt="Emergency medical support illustration"
            className="relative z-10 w-full max-w-[640px] drop-shadow-[0_18px_30px_rgba(15,23,42,0.12)]"
          />
        </div>
      </div>
    </section>
  )
}

export default EmergencyBanner