import Header from '../Components/Header'
import Footer from '../Components/Home/Footer'
import WeekWise from './WeekWise'
import WeekSidebar from '../Components/WeekSidebar'
import { useParams } from 'react-router-dom'
import useAxiosSecure from '../Hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

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
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-2">
      <WeekSidebar weekInfo={weeksData} isLoading={weeksLoading} />
        </div>
        <div className="lg:col-span-10">
      <WeekWise data={data} isLoading={isLoading || weeksLoading} />
        </div>

            </div>
        </main>
        <Footer />
    </div>
  )
}

export default WeekGuidance