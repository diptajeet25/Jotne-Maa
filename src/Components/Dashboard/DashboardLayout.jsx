import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import showToast from '../../utils/showToast'

const DashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const resolveActiveKey = () => {
    const path = location.pathname
    if (path.includes('/dashboard/diet')) return 'diet'
    if (path.includes('/dashboard/mental-health')) return 'mental-health'
    if (path.includes('/dashboard/report-analyzer')) return 'report-analyzer'
    if (path.includes('/dashboard/risk-analyzer')) return 'risk-analyzer'
    if (path.includes('/dashboard/doctor-appointments-dashboard')) return 'appointments'
    return 'overview'
  }

  const handleSelect = (item) => {
    if (item?.key === 'logout') {
      setMobileOpen(false)
      navigate('/auth/signin')
      showToast('Logged out successfully.', 'success')
      return
    }

    setMobileOpen(false)
    navigate(item.path)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,236,242,0.55),transparent_24%),linear-gradient(180deg,#fff8fb_0%,#ffffff_100%)] text-slate-900">
      <Navbar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex w-full gap-0 px-0 py-0">
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 cursor-default bg-slate-950/35 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <Sidebar
          activeKey={resolveActiveKey()}
          onSelect={handleSelect}
          onClose={() => setMobileOpen(false)}
          mobileOpen={mobileOpen}
          collapsed={desktopCollapsed}
          onToggleCollapse={() => setDesktopCollapsed((prev) => !prev)}
        />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
