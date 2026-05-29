import Header from '../Components/Header'
import Footer from '../Components/Home/Footer'
import WeekWise from './WeekWise'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import useAxiosSecure from '../Hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const WeekSelect = ({ weeks = [], loading, currentWeek }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const getNumber = (item, idx) => item?.week ?? item?.number ?? item?.id ?? idx + 1
  const getLabel = (item, idx) => item?.title ?? item?.name ?? `Week ${getNumber(item, idx)}`

  return (
    <div className="w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-left text-sm font-medium shadow-sm hover:shadow-md"
      >
        {currentWeek ? `Week ${currentWeek}` : 'Select Week'}
        <span className="float-right text-xs opacity-70">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full max-w-xs rounded-md bg-white p-3 shadow-lg">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {(weeks || []).map((wk, idx) => {
                const num = getNumber(wk, idx)
                const label = getLabel(wk, idx)
                const active = String(num) === String(currentWeek)
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setOpen(false)
                      navigate(`/week/${num}`)
                    }}
                    className={`rounded-md px-2 py-2 text-left text-xs transition-colors ${
                      active ? 'bg-pink-50 text-pink-600 font-semibold' : 'hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const WeekGuidance = () => {
    const params=useParams();
    const axiosSecure = useAxiosSecure();
    console.log(params.weekNumber);
  const {data,isLoading}=useQuery(
        {
            queryKey:['weekGuidance',params.weekNumber],
            queryFn:async()=>{
                const res=await axiosSecure.get(`/weekdata?week=${params.weekNumber}`);
                return res.data;
            }
        }
    )
  const {data:weeksData,isLoading:weeksLoading}=useQuery(
    {
      queryKey:['weeks'],
      queryFn:async()=>{
        const res=await axiosSecure.get('/weeks');
        return Array.isArray(res.data) ? res.data : [res.data];
      }
    }
  )
    console.log(data);
  return (
  <div className="bg-slate-50">
        <Header />
    <main className="px-4 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:items-start">
        <div className="col-span-1 lg:col-span-1">
          <div className="mb-4 w-full lg:max-w-md">
            <WeekSelect weeks={weeksData} loading={weeksLoading} currentWeek={params.weekNumber} />
          </div>
        </div>
        <div className="col-span-1">
          <WeekWise data={data} isLoading={isLoading || weeksLoading} />
        </div>

            </div>
        </main>
        <Footer />
    </div>
  )
}

export default WeekGuidance