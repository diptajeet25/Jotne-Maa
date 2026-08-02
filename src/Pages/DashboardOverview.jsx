import { Brain, CalendarDays, FileText, ShieldAlert, UtensilsCrossed } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OverviewCard from '../Components/Dashboard/OverviewCard'

const dashboardCards = [
  {
    title: 'Diet Planner',
    description: 'Build a nutrient-rich meal plan that fits your trimester and comfort needs.',
    icon: UtensilsCrossed,
    accentClass: 'from-[#34d399] to-[#14b8a6]',
    path: '/dashboard/diet',
  },
  {
    title: 'Mental Health',
    description: 'Stay supported with mindful practices, journaling, and care prompts.',
    icon: Brain,
    accentClass: 'from-[#8b5cf6] to-[#ec4899]',
    path: '/dashboard/mental-health',
  },
  {
    title: 'Risk Analyzer',
    description: 'Review maternal risk signals with a calm, AI-guided screening experience.',
    icon: ShieldAlert,
    accentClass: 'from-[#ef4444] to-[#f97316]',
    path: '/dashboard/risk-analyzer',
  },
  {
    title: 'Report Analyzer',
    description: 'Organize tests and reports with clarity so your care team can see what matters.',
    icon: FileText,
    accentClass: 'from-[#0ea5e9] to-[#2563eb]',
    path: '/dashboard/report-analyzer',
  },
  {
    title: 'Doctor Appointments',
    description: 'View upcoming visits and stay aligned with your care schedule.',
    icon: CalendarDays,
    accentClass: 'from-[#fb7185] to-[#f43f5e]',
    path: '/dashboard/doctor-appointments-dashboard',
  },
]

const DashboardOverview = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-6">
        <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-[#fff8fb] to-[#f8f5ff] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">
                Dashboard overview
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Your pregnancy care hub, beautifully organized.
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Move from care guidance to appointments and planning without leaving your trusted workspace.
              </p>
            </div>
            <div className="rounded-[20px] border border-pink-100 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">Everything in one place</p>
              <p className="mt-1">Support, planning, and care coordination.</p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card) => (
            <OverviewCard
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
              accentClass={card.accentClass}
              onOpen={() => navigate(card.path)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
