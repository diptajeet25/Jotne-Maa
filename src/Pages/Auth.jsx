import Header from '../Components/Header'
import authside from '../assets/Auth.png'
import { Outlet, useLocation } from 'react-router-dom'

const Auth = () => {
  const location = useLocation()
  const isSignIn = location.pathname.includes('/signin')

  return (
    <div className="min-h-screen bg-[#fffafc]">
      <Header />

      <main className="relative isolate px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ffd2e6]/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 -z-10 h-80 w-80 rounded-full bg-[#eadcff]/70 blur-3xl" />

        <div className="mx-auto flex w-full max-w-6xl justify-center">
          <div
            className={[
              'grid w-full grid-cols-1 rounded-3xl border border-[#f6e7f1] bg-white shadow-[0_26px_70px_rgba(157,93,229,0.12)] lg:grid-cols-2',
              isSignIn ? 'lg:min-h-[640px]' : 'lg:min-h-[720px]',
            ].join(' ')}
          >
            <div className="flex items-center overflow-visible p-6 sm:p-9 lg:p-12">
              <div className="mx-auto w-full max-w-xl">
                <Outlet />
              </div>
            </div>

            <div className="relative hidden lg:flex lg:items-center lg:justify-center lg:bg-[#faf4ff] lg:p-8">
              <img
                src={authside}
                alt="Motherhood support illustration"
                className={[
                  'w-full rounded-2xl object-contain object-center',
                  isSignIn ? 'max-h-[560px]' : 'max-h-[640px]',
                ].join(' ')}
              />
              <div className="pointer-events-none absolute inset-8 rounded-2xl ring-1 ring-white/60" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Auth