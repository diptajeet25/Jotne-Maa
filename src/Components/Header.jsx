import { useContext } from 'react'
import logo from '../assets/logo.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import useUser from '../Hooks/useUser'
import Loading from './Loading'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/emergency', label: 'Emergency' },
 
]
const usernavItems=[

  { to: '/symptom-check', label: 'Symptoms Checker' },
  { to: '/pregnancy-diet-planner', label: 'Diet Planner' },
  { to: '/booking-appointment', label: 'Doctor Appointments' },
  { to: '/mental-health', label: 'Mental Health' },
  { to: '/maternal-risk-screening', label: 'Risk Analyzer' },
  { to: '/report-analyzer', label: 'Report Analyzer' }

]
const doctornavItems=[
  { to: '/doctor-appointments-dashboard', label: 'My Appointments' }
]



const Header = () => {
  const navigate=useNavigate();
  const linkClass = ({ isActive }) =>
    [
      'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium leading-none transition-all duration-200',
      isActive
        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] font-semibold'
        : 'text-slate-700/90 hover:text-pink-600 hover:bg-pink-50',
    ].join(' ')
  const { user, logoutUser,loading } = useContext(AuthContext)
  const {userData,isLoading}=useUser();
  console.log(userData);
  const allNavItems = [
  ...navItems,
  ...(userData?.role === 'user' ? usernavItems : []),
  ...(userData?.role === 'doctor' ? doctornavItems : []),
];

  const handleLogout = async () => {
    await logoutUser()
    alert('Logged out successfully!')
    navigate('/auth/signin')

  }
  if(isLoading || loading)
    return <Loading></Loading>


  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-slate-100/40 shadow-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <div className="dropdown">
            <div tabIndex="0" role="button" className="lg:hidden inline-flex items-center justify-center rounded-full p-2 bg-white/70 shadow-sm hover:bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex="0"
              className="menu menu-sm dropdown-content left-0 mt-3 w-[calc(100vw-2rem)] max-w-100 rounded-box border border-white/20 bg-white/60 backdrop-blur-md p-3 shadow-xl"
            >
              {allNavItems.map((item) => (
                <li key={item.to} className="flex">
                  <NavLink to={item.to} className={linkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2 px-1 sm:flex-row">
                <Link
                  to="/auth"
                  className="btn btn-sm flex-1 rounded-full border border-pink-200 bg-white/70 px-5 font-semibold text-pink-600 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 hover:shadow-md"
                >
                  Sign Up
                </Link>
                <Link
                  to="/auth/signin"
                  className="btn btn-sm flex-1 rounded-full border-0 bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 font-semibold text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(155,93,229,0.24)]"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Jotne Maa logo" className="h-12 w-12 shrink-0 rounded-3xl bg-gradient-to-br from-[#FFF0F6] to-[#F5F3FF] p-1 shadow-md ring-1 ring-white/50" />
            <div className="min-w-0 leading-tight">
              <h1 className="text-lg font-extrabold text-slate-900 sm:text-xl">Jotne Maa</h1>
              <p className="text-xs text-slate-500 sm:text-sm">Together in Your Motherhood Journey</p>
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center justify-center gap-2">
            {allNavItems.map((item) => (
              <li key={item.to} className="flex items-center">
                <NavLink to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:flex items-center justify-end gap-3">
          {user?.emailVerified ? (
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <span className="inline-flex h-3 w-3 rounded-full bg-pink-500" />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/auth"
                className="rounded-full cursor-pointer border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 hover:shadow-md"
              >
                Sign Up
              </Link>
              <Link
                to="/auth/signin"
                className="rounded-full cursor-pointer border-0 bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(155,93,229,0.24)]"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header