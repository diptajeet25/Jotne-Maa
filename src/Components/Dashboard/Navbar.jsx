import { useContext } from 'react'
import { Link, NavLink, useMatch } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import { House, Info, ShieldAlert, LayoutGrid, CalendarDays, Menu } from 'lucide-react'
import logo from '../../assets/logo.png'
import ProfileDropdown from './ProfileDropdown'

const navItems = [
  { to: '/', label: 'Home', icon: House },
  { to: '/about', label: 'About Us', icon: Info },
  { to: '/week/1', label: 'Weekly', icon: CalendarDays },
  { to: '/emergency', label: 'Emergency', icon: ShieldAlert },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
]

const Navbar = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext)
  const weeklyMatch = useMatch('/week/:weekNumber')
  const isWeeklyActive = Boolean(weeklyMatch)

  const linkClass = (isActive) =>
    [
      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all',
      isActive
        ? 'bg-gradient-to-r from-[#ff5fa2] to-[#9b5de5] text-white shadow-[0_12px_24px_rgba(155,93,229,0.20)]'
        : 'text-slate-700 hover:bg-pink-50 hover:text-pink-600',
    ].join(' ')

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100/80 bg-white/85 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#fff2f7] to-[#f5f0ff] shadow-sm ring-1 ring-pink-100" aria-hidden>
              <img src={logo} alt="Jotne Maa logo" className="h-7 w-7 object-contain" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-black tracking-tight text-slate-900">Jotne Maa</p>
              <p className="text-xs text-slate-500">Maternity care, thoughtfully designed</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.to === '/week/1' ? isWeeklyActive : false
            return (
              item.to === '/week/1' ? (
                <Link key={item.to} to={item.to} className={linkClass(isActive)}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ) : (
                <NavLink key={item.to} to={item.to} className={({ isActive: navActive }) => linkClass(navActive)}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <ProfileDropdown />
          ) : (
            <Link to="/auth/signin" className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm transition hover:border-pink-300 hover:bg-pink-50">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

// decorative heart removed

export default Navbar
