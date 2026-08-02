import { motion } from 'framer-motion'

const SidebarItem = ({ icon: Icon, label, active, collapsed, onClick, isLogout = false }) => {
  const baseBtn = `flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${collapsed ? 'lg:w-12 lg:justify-center lg:gap-0 lg:px-0' : ''}`

  const activeClasses = 'bg-linear-to-r from-[#ff5fa2] to-[#9b5de5] text-white shadow-[0_14px_30px_rgba(155,93,229,0.20)]'
  const normalClasses = isLogout ? 'text-slate-600 hover:bg-rose-50 hover:text-pink-600' : 'text-slate-600 hover:bg-pink-50 hover:text-pink-600'

  const isActive = active && !isLogout
  const iconBg = isActive ? 'bg-white/20' : 'bg-pink-50 text-pink-600'

  return (
    <motion.button
      whileHover={{ x: 2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`${baseBtn} ${isActive ? activeClasses : normalClasses}`}
    >
      <span className={`rounded-2xl p-2 ${iconBg} ${collapsed ? 'lg:p-2' : ''}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
    </motion.button>
  )
}

export default SidebarItem
