import { NavLink } from 'react-router-dom';

const WeekSidebar = ({ weekInfo, isLoading }) => {


  return (
    <aside className="sticky top-20 rounded-2xl border border-pink-100 bg-white p-4  shadow-sm">
      <h2 className="mb-3 text-lg font-bold text-slate-900">Weeks</h2>

      <div className="space-y-1">
        {isLoading || weekInfo === undefined ? (
          <div className="rounded-lg px-3 py-2 text-sm text-slate-500">
            Loading weeks...
          </div>
        ) : (
          weekInfo?.map((week) => (
          <NavLink
            key={week._id ?? week.week}
            to={`/week/${week.week}`}
            className={({ isActive }) =>
              [
                'block rounded-lg px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-700 hover:bg-pink-50 hover:text-pink-600',
              ].join(' ')
            }
          >
            Week {week.week}
          </NavLink>
          ))
        )}
      </div>
    </aside>
  )
}

export default WeekSidebar