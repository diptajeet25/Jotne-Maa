import { Menu, Home, UtensilsCrossed, Brain, ShieldAlert, FileText, CalendarDays, Stethoscope, LogOut, PanelLeftClose, MessageCircleMore } from 'lucide-react'
import SidebarItem from './SidebarItem'

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
  { key: 'diet', label: 'Diet Planner', icon: UtensilsCrossed, path: '/dashboard/diet' },
  { key: 'mental-health', label: 'Mental Health', icon: Brain, path: '/dashboard/mental-health' },
  { key: 'care-ai', label: 'Talk to care AI', icon: MessageCircleMore, path: '/chatbot' },
  { key: 'risk-analyzer', label: 'Risk Analyzer', icon: ShieldAlert, path: '/dashboard/risk-analyzer' },
  { key: 'report-analyzer', label: 'Report Analyzer', icon: FileText, path: '/dashboard/report-analyzer' },
  { key: 'book-appointment', label: 'Book Appointment', icon: Stethoscope, path: '/booking-appointment' },
  { key: 'appointments', label: 'Doctor Appointments', icon: CalendarDays, path: '/dashboard/doctor-appointments-dashboard' },
]

const Sidebar = ({ activeKey, onSelect, onClose, mobileOpen, collapsed, onToggleCollapse }) => (
  <aside
    className={`fixed left-0 top-0 z-40 flex h-dvh w-65 flex-col border-r border-pink-100 bg-white/95 px-6 py-6 shadow-[16px_0_45px_rgba(244,63,94,0.08)] backdrop-blur-xl transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-fit lg:self-start lg:rounded-3xl lg:border lg:shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'lg:w-20' : 'lg:w-65'}`}
  >
    <div className={`relative flex ${collapsed ? 'items-center justify-center lg:h-14' : 'items-start justify-between'} gap-3 px-1`}>
      <div className={collapsed ? 'lg:hidden' : 'min-w-0 pt-0.5'}>
        <p className="text-sm font-bold leading-none text-slate-900">Dashboard</p>
        <p className="mt-1 text-xs text-slate-500">Care workspace</p>
      </div>

      <button
        type="button"
        onClick={mobileOpen ? onClose : onToggleCollapse}
        className={`inline-flex rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:text-pink-600 lg:text-slate-500 ${collapsed ? 'lg:absolute lg:-right-3 lg:top-1/2 lg:-translate-y-1/2' : ''}`}
        aria-label={mobileOpen ? 'Close sidebar' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {mobileOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>

    <nav className="mt-6 flex flex-col space-y-5">
      {sidebarItems.map((item) => (
        <SidebarItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          active={activeKey === item.key}
          collapsed={collapsed}
          onClick={() => onSelect(item)}
        />
      ))}
      <div className="mt-1 border-t border-pink-100/70 pt-3">
        <SidebarItem
          icon={LogOut}
          label="Logout"
          active={false}
          isLogout
          collapsed={collapsed}
          onClick={() => onSelect({ key: 'logout', path: '/auth/signin' })}
        />
      </div>
    </nav>
  </aside>
)

// decorative heart removed

export default Sidebar
