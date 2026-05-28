import adviseImg from '../assets/Week/advise.avif'
import babyDevImg from '../assets/Week/babydevelopment.jpg'
import motherBodyImg from '../assets/Week/motherbody.avif'
import precautionImg from '../assets/Week/precaution.png'
import waterImg from '../assets/Week/water.png'
import sleepImg from '../assets/Week/sleep.png'
import mentalHealthImg from '../assets/Week/mentalhealth.png'
import doctorImg from '../assets/Week/Doctor.png'
import emergencyImg from '../assets/Week/emergency.png'
import checklistImg from '../assets/Week/checkList.png'
import funFactImg from '../assets/Week/funfact.png'
import Loading from '../Components/Loading'

const defaultWeekData = {
  babyDevelopment: [],
  motherBody: [],
  commonSymptoms: [],
  advice: [],
  foodsForYou: [],
  foodsToAvoid: [],
  exercise: [],
  meditation: [],
  waterIntake: '',
  sleep: '',
  emergencyWarning: [],
  checklist: [],
  funFact: '',
}

const WeekWise = ({data, isLoading}) => {
  if (isLoading) {
    return <Loading />
  }

  const weekData = data ?? defaultWeekData
  


  return (
    <div className="p-4 px-2">
      <div className="max-w-7xl mx-auto">

        {/* Header: Week title + trimester badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-extrabold text-slate-900">Week {weekData.week}</h1>
            <span className="inline-block bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-semibold text-sm">{weekData.trimester}</span>
          </div>
 
        </div>

        {/* Summary card: pink background with divided sections */}
        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-stretch md:justify-between divide-y md:divide-y-0 md:divide-x divide-pink-100">
            <div className="flex items-center gap-4 p-4 md:flex-1">
              <div className="w-56 h-56 rounded-full p-2 flex items-center justify-center">
                <img src={weekData.pregnancy?.logo} alt="pregnancy" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Your pregnancy</div>
                <div className="text-base font-semibold text-slate-800">{weekData.pregnancy?.message}</div>
               
              </div>
            </div>

            <div className="p-4 flex-1 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-500">Baby Size</div>
                <div className="flex items-center gap-2 justify-center mt-2">
                  <img src={weekData.babySize?.logo} alt="baby size" className="w-6 h-6" />
                  <div className="font-medium">{weekData.babySize?.name}</div>
                </div>
              </div>
            </div>

            <div className="p-4 flex-1 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-500">Baby Length</div>
                <div className="mt-2 font-medium text-slate-800 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
                    <path d="M6 7v10" />
                    <path d="M10 7v10" />
                    <path d="M14 7v10" />
                    <path d="M18 7v10" />
                  </svg>
                  <span>{weekData.babyLength}</span>
                </div>
                <div className="text-xs text-gray-500">(approx.)</div>
              </div>
            </div>

            <div className="p-4 flex-1 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-500">Baby Weight</div>
                <div className="mt-2 font-medium text-slate-800 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 20H3v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2z" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{weekData.babyWeight}</span>
                </div>
                <div className="text-xs text-gray-500">(approx.)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Row 1: Body development, Mother Body Change */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card title="Baby Development">
              <div className="flex items-start gap-4">
                <ul className="space-y-3 flex-1">
                  {weekData.babyDevelopment.map((item, i) => (
                    <li key={i} className="flex gap-3"><span>•</span><span>{item.point}</span></li>
                  ))}
                </ul>
                <img src={babyDevImg} alt="baby development" className="w-36 h-36 rounded-md object-cover ml-6" />
              </div>
            </Card>

            <Card title="Mother Body Change">
              <div className="flex items-start gap-4">
                <ul className="space-y-3 flex-1">
                  {weekData.motherBody.map((item, i) => (
                    <li key={i} className="flex gap-3"><span>•</span><span>{item.point}</span></li>
                  ))}
                </ul>
                <img src={motherBodyImg} alt="mother body" className="w-36 h-36 rounded-md object-cover ml-6" />
              </div>
            </Card>
          </div>

          {/* Row 2: Common Symptoms, Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card title="Common Symptoms">
              <div className="grid grid-cols-2 gap-4">
                {weekData.commonSymptoms.map((item, i) => (
                  <div key={i} className="text-center">
                    <img src={item.logo} alt="" className="w-14 h-14 mx-auto" />
                    <p className="text-sm mt-2 font-medium">{item.point}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Advice For You">
              <div className="flex items-center justify-between">
                <ul className="space-y-2 text-sm text-gray-700 flex-1">
                  {weekData.advice.map((item, i) => (
                    <li key={i} className="flex gap-3"><span>•</span><span>{item}</span></li>
                  ))}
                </ul>
                <img src={adviseImg} alt="advice" className="w-36 h-36 ml-6" />
              </div>
            </Card>
          </div>

          {/* Row 3: Foods To Eat, Foods To Avoid, Precautions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card title="Foods To Eat">
              <div className="grid grid-cols-4 gap-3 items-center">
                {weekData.foodsForYou.map((item, i) => (
                  <div key={i} className="text-center">
                    <img src={item.logo} alt="" className="w-12 h-12 mx-auto" />
                    <p className="text-xs mt-2 font-medium">{item.name}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Foods To Avoid">
              <div className="grid grid-cols-4 gap-3 items-center">
                {weekData.foodsToAvoid.map((item, i) => (
                  <div key={i} className="text-center">
                    <img src={item.logo} alt="" className="w-12 h-12 mx-auto" />
                    <p className="text-xs mt-2 font-medium">{item.name}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Precautions">
              <div className="flex items-center justify-between">
                <ul className="space-y-2 text-sm text-gray-700 flex-1">
                  <li>Avoid smoking and alcohol.</li>
                  <li>Don't take any medicine without doctor advice.</li>
                  <li>Avoid heavy lifting.</li>
                  <li>Keep yourself clean and hydrated.</li>
                </ul>
                <img src={precautionImg} alt="precaution" className="w-24 h-24 ml-4" />
              </div>
            </Card>
          </div>

          {/* Row 4: Safe Exercises, Meditation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card title="Safe Exercises">
              <div className="grid grid-cols-2 gap-4">
                {weekData.exercise.map((item, i) => (
                  <div key={i} className="text-center">
                    <img src={item.logo} alt="" className="w-14 h-14 mx-auto" />
                    <p className="text-sm mt-2 font-medium">{item.name}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Meditation & Relaxation">
              <div className="grid grid-cols-2 gap-4">
                {weekData.meditation.map((item, i) => (
                  <div key={i} className="text-center">
                    <img src={item.logo} alt="" className="w-14 h-14 mx-auto" />
                    <p className="text-sm mt-2 font-medium">{item.name}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Row 5: Water, Sleep, Mental Health, Doctor Advice (4 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Card title="Hydration">
              <div className="text-center">
                <img src={waterImg} alt="water" className="w-16 h-16 mx-auto" />
                <h3 className="font-bold text-xl mt-3">{weekData.waterIntake}</h3>
              </div>
            </Card>

            <Card title="Sleep Care">
              <div className="text-center">
                <img src={sleepImg} alt="sleep" className="w-16 h-16 mx-auto" />
                <h3 className="font-bold text-xl mt-3">{weekData.sleep}</h3>
              </div>
            </Card>

            <Card title="Mental Health">
              <div className="flex items-center gap-4">
                <img src={mentalHealthImg} alt="mental" className="w-24 h-24" />
                <p className="text-sm text-gray-700">It's normal to feel different. Be kind to yourself and stay happy.</p>
              </div>
            </Card>

            <Card title="Doctor Advice">
              <div className="flex items-center gap-4">
                <img src={doctorImg} alt="doctor" className="w-24 h-24" />
                <p className="text-sm text-gray-700">Book an appointment for early guidance and check-up.</p>
              </div>
            </Card>
          </div>

          {/* Row 6: Emergency, Checklist, Fun Fact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card title="Emergency Warning">
              <div className="flex items-center justify-between">
                <ul className="space-y-3 text-red-500 flex-1">
                  {weekData.emergencyWarning.map((item, i) => (
                    <li key={i} className="flex gap-3"><span>⚠️</span><span>{item}</span></li>
                  ))}
                </ul>

                <img src={emergencyImg} alt="emergency" className="w-24 h-24 ml-4" />
              </div>
            </Card>

            <Card title="Checklist">
              <div className="flex items-start gap-4">
                <div className="space-y-3 flex-1">
                  {weekData.checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5" /><p>{item}</p></div>
                  ))}
                </div>

                <img src={checklistImg} alt="checklist" className="w-24 h-24" />
              </div>
            </Card>

            <Card title="Fun Fact">
              <div className="flex items-center gap-4">
                <p className="text-gray-700 leading-7 text-lg flex-1">{weekData.funFact}</p>
                <img src={funFactImg} alt="funfact" className="w-28 h-28" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const Card = ({ title, children }) => {
  return (
    <div className="bg-white border border-pink-100 rounded-[30px] p-6 shadow-sm hover:shadow-md duration-300 min-h-37.5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-pink-600">{title}</h2>
        <div className="ml-4" />
      </div>

      <div className="flex-1 text-sm text-gray-700">{children}</div>
    </div>
  )
}

export default WeekWise
