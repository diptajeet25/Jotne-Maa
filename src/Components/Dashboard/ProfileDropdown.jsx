import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import { ChevronDown, LogOut, UserCircle2 } from 'lucide-react'
import showToast from '../../utils/showToast'

const ProfileDropdown = () => {
  const { user, logoutUser } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const initials = (user?.displayName || user?.email || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/auth/signin')
    await showToast('Logged out successfully.', 'success')
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-2 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff5fa2] to-[#9b5de5] text-sm font-semibold text-white shadow-sm">
          {initials}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold text-slate-800">{user?.displayName || 'My Profile'}</p>
          <p className="text-xs text-slate-500">{user?.email || 'Patient'}</p>
        </div>
        <ChevronDown className="mr-1 h-4 w-4 text-slate-500" />
      </button>

      {open ? (
        <div className="absolute right-0 mt-3 w-64 rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 rounded-2xl bg-pink-50/70 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ff5fa2] to-[#9b5de5] text-sm font-semibold text-white">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{user?.displayName || 'Welcome back'}</p>
              <p className="text-xs text-slate-500">{user?.email || 'Signed in securely'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ProfileDropdown
