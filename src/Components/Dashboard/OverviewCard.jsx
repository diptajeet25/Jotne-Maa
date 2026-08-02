import { motion } from 'framer-motion'

const OverviewCard = ({ title, description, icon: Icon, accentClass, onOpen }) => (
  <motion.article
    whileHover={{ y: -4, scale: 1.01 }}
    className="rounded-[24px] border border-slate-100 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
  >
    <div className={`inline-flex rounded-[18px] bg-gradient-to-br ${accentClass} p-3 text-white shadow-lg`}>
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    <button
      type="button"
      onClick={onOpen}
      className="mt-5 inline-flex items-center rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
    >
      Open
    </button>
  </motion.article>
)

export default OverviewCard
