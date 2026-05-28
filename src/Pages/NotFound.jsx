import { ArrowLeft, Heart, Home, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import illustration404 from '../assets/404.png'

const NotFound = () => {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#fff8fd] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(255,194,220,0.55),transparent_60%),radial-gradient(circle_at_80%_20%,rgba(188,156,255,0.25),transparent_45%)]" />
      <div className="pointer-events-none absolute left-10 top-24 -z-10 h-24 w-24 rounded-full bg-[#ffb6d6]/25 blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-44 -z-10 h-28 w-28 rounded-full bg-[#d8c2ff]/35 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(155,93,229,0.12)] backdrop-blur xl:grid-cols-[1.05fr_0.95fr]">
          <section className="relative flex items-center justify-center bg-linear-to-br from-[#ffe4f0] via-[#fff8fc] to-[#f2e7ff] px-4 py-8 sm:px-8 lg:px-10 xl:min-h-[42rem]">
            <div className="absolute left-8 top-8 h-5 w-5 rounded-full bg-white/80 shadow-sm" />
            <div className="absolute right-12 top-12 h-4 w-4 rounded-full bg-[#ffb6d6] shadow-sm" />
            <div className="absolute left-14 bottom-16 h-3 w-3 rounded-full bg-[#9b5de5]/35 shadow-sm" />
            <div className="absolute right-10 bottom-20 h-6 w-6 rounded-full border border-dashed border-[#ff7eb6]/60 bg-white/50" />

            <div className="relative w-full max-w-[34rem] sm:max-w-[40rem] lg:max-w-[46rem]">
              <div className="absolute left-1/2 top-6 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-white/55 blur-2xl sm:h-[36rem] sm:w-[36rem] lg:h-[40rem] lg:w-[40rem]" />
              <div className="absolute left-1/2 top-12 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full border border-white/80 sm:h-[32rem] sm:w-[32rem] lg:h-[36rem] lg:w-[36rem]" />

              <div className="relative mx-auto aspect-[3/2] w-full max-w-[46rem]">
                <img
                  src={illustration404}
                  alt="Pregnant cartoon woman sitting thoughtfully"
                  className="h-full w-full object-contain drop-shadow-[0_24px_40px_rgba(155,93,229,0.16)] sm:scale-[1.08] lg:scale-[1.16]"
                />
              </div>
            </div>
          </section>

          <section className="flex items-center px-6 py-10 sm:px-10 lg:px-12 xl:px-14 xl:py-16">
            <div className="w-full max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-pink-600 shadow-sm">
                <Sparkles size={14} />
                Page not found
              </div>

              <div className="mt-6 flex items-start gap-4 text-slate-400">
                <div className="rounded-3xl bg-[#fff7fb] px-5 py-3 shadow-sm ring-1 ring-[#f7e4ee]">
                  <div className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">404</div>
                </div>
                <div className="pt-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Oops</p>
                  <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                    This maternity care page could not be found.
                  </p>
                </div>
              </div>

              <h1 className="mt-6  text-xl font-bold leading-tight text-slate-900 sm:text-4xl">
                The page you were looking for has drifted away.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                We couldn’t find that address, but you’re still in the right place. Return to the homepage, continue to sign in journey.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#ff5fa2] to-[#9b5de5] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(155,93,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(155,93,229,0.3)] sm:min-w-52"
                >
                  <Home size={18} />
                  Go Home
                </Link>

                <Link
                  to="/auth/signin"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-pink-200 hover:bg-pink-50/50 hover:text-pink-700 sm:min-w-52"
                >
                  <ArrowLeft size={18} />
                  Back to Sign In
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl bg-[#fff7fb] p-4 ring-1 ring-[#f7e4ee]">
                  <div className="rounded-full bg-pink-50 p-2 text-pink-600">
                    <Heart size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Gentle support</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Your care tools are still one click away.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-[#fff7fb] p-4 ring-1 ring-[#f7e4ee]">
                  <div className="rounded-full bg-purple-50 p-2 text-purple-600">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Quick recovery</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Use the navigation to get back on track fast.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default NotFound
