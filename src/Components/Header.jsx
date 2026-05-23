import { useContext } from 'react'
import logo from '../assets/logo.png'
import { Link, NavLink } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { useNavigate } from 'react-router'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Emergency Services' },
]

const Header = () => {
  const linkClass = ({ isActive }) =>
    [
      'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
      isActive
        ? 'text-transparent bg-clip-text bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] font-semibold'
        : 'text-slate-700/80 hover:text-slate-900',
    ].join(' ')
    const {user,logoutUser}=useContext(AuthContext);
    const navigate=useNavigate();
    const handleLogout=()=>{
        logoutUser();
        alert("Logged out successfully!");
        navigate('/auth/signin');
    }

  return (
    <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="navbar mx-auto max-w-7xl flex-wrap gap-3 px-4 py-3 lg:flex-nowrap lg:px-6">
        <div className="navbar-start flex-1 gap-3 lg:flex-none">
          <div className="dropdown">
            <div tabIndex="0" role="button" className="btn btn-ghost lg:hidden">
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
              className="menu menu-sm dropdown-content left-0 mt-3 w-[calc(100vw-2rem)] max-w-80 rounded-box border border-white/20 bg-white/60 backdrop-blur-md p-3 shadow-xl"
            >
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={linkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2 px-1 sm:flex-row">
                <button className="btn btn-sm flex-1 rounded-full border border-pink-200 bg-white/70 px-5 font-semibold text-pink-600 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 hover:shadow-md">
                  Sign Up
                </button>
                <button className="btn btn-sm flex-1 rounded-full border-0 bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 font-semibold text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(155,93,229,0.24)]">
                  Sign In
                </button>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <img src={logo} alt="Jotne Maa logo" className="h-10 w-10 shrink-0 rounded-2xl bg-linear-to-r from-[#FFEBF3] to-[#F3F0FF] p-1 shadow-sm ring-1 ring-white/40" />
            <div className="min-w-0 leading-tight">
              <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">Jotne Maa</h1>
              <p className="text-xs text-slate-500 sm:text-sm">Together in Your Motherhood Journey</p>
            </div>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
{ user ? <div className="navbar-end hidden gap-3 lg:flex">
          <button onClick={handleLogout} className="rounded-full cursor-pointer border border-pink-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-pink-600 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 hover:shadow-md">
            Logout
          </button> </div> : <div className="navbar-end hidden gap-3 lg:flex">
          <Link to="/auth" className="rounded-full cursor-pointer border border-pink-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-pink-600 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 hover:shadow-md">
            Sign Up
          </Link>
          <Link to="/auth/signin" className="rounded-full cursor-pointer border-0 bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(155,93,229,0.24)]">
            Sign In
          </Link>
        </div> 

}
        
        
      </div>
    </header>
  )
}

export default Header