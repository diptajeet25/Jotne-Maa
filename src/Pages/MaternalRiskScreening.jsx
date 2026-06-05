import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import {
  RiAlertLine,
  RiBarChart2Line,
  RiCheckboxCircleLine,
  RiHeartPulseLine,
  RiInformationLine,
  RiLoader4Line,
  RiSparklingLine,
  RiStethoscopeLine,
  RiUser3Line,
} from 'react-icons/ri'
import Header from '../Components/Header.jsx'
import Footer from '../Components/Home/Footer.jsx'
import PregnancyComplicationsSection from '../Components/PregnancyComplicationsSection.jsx'

const API_URL = 'https://maternal-risk-api-xbu6.onrender.com/predict'

const selectOptions = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 },
]

const fieldGroups = [
  {
    name: 'Age',
    label: 'Age',
    type: 'number',
    icon: RiUser3Line,
    placeholder: 'Enter age',
  },
  {
    name: 'Systolic_BP',
    label: 'Systolic BP',
    type: 'number',
    icon: RiHeartPulseLine,
    placeholder: 'Enter systolic BP',
  },
  {
    name: 'Diastolic',
    label: 'Diastolic BP',
    type: 'number',
    icon: RiStethoscopeLine,
    placeholder: 'Enter diastolic BP',
  },
  {
    name: 'BS',
    label: 'Blood Sugar',
    type: 'number',
    icon: RiSparklingLine,
    placeholder: 'Enter blood sugar',
  },
  {
    name: 'Body_Temp',
    label: 'Body Temperature',
    type: 'number',
    icon: RiAlertLine,
    placeholder: 'Enter body temperature',
  },
  {
    name: 'BMI',
    label: 'BMI',
    type: 'number',
    icon: RiBarChart2Line,
    placeholder: 'Enter BMI',
  },
  {
    name: 'Previous_Complications',
    label: 'Previous Complications',
    type: 'select',
    icon: RiInformationLine,
  },
  {
    name: 'Preexisting_Diabetes',
    label: 'Preexisting Diabetes',
    type: 'select',
    icon: RiInformationLine,
  },
  {
    name: 'Gestational_Diabetes',
    label: 'Gestational Diabetes',
    type: 'select',
    icon: RiInformationLine,
  },
  {
    name: 'Mental_Health',
    label: 'Mental Health Issues',
    type: 'select',
    icon: RiInformationLine,
  },
  {
    name: 'Heart_Rate',
    label: 'Heart Rate',
    type: 'number',
    icon: RiHeartPulseLine,
    placeholder: 'Enter heart rate',
  },
]

const riskPalette = {
  low: {
    label: 'Low Risk',
    ring: 'from-emerald-400 via-emerald-500 to-green-500',
    chip: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    accent: 'text-emerald-700',
    bg: 'bg-emerald-50',
    icon: RiCheckboxCircleLine,
    description: 'Your risk level is low. Continue maintaining a healthy lifestyle.',
  },
  mid: {
    label: 'Mid Risk',
    ring: 'from-amber-300 via-orange-400 to-amber-500',
    chip: 'bg-amber-100 text-amber-700 border-amber-200',
    accent: 'text-amber-700',
    bg: 'bg-amber-50',
    icon: RiAlertLine,
    description: 'Your risk level is moderate. Consider consulting a healthcare professional.',
  },
  high: {
    label: 'High Risk',
    ring: 'from-rose-400 via-red-500 to-red-600',
    chip: 'bg-rose-100 text-rose-700 border-rose-200',
    accent: 'text-rose-700',
    bg: 'bg-rose-50',
    icon: RiAlertLine,
    description: 'Your risk level is high. Immediate medical consultation is recommended.',
  },
  neutral: {
    label: 'Awaiting prediction',
    ring: 'from-slate-200 via-slate-300 to-slate-400',
    chip: 'bg-slate-100 text-slate-600 border-slate-200',
    accent: 'text-slate-600',
    bg: 'bg-slate-50',
    icon: RiInformationLine,
    description: 'Fill out the form and submit to see the AI prediction result here.',
  },
}

const normalizeRiskLevel = (value) => {
  const level = String(value ?? '').trim().toLowerCase()

  if (['low', '0', 'no risk'].includes(level)) {
    return 'low'
  }

  if (['mid', 'medium', 'moderate', 'medium risk', 'moderate risk'].includes(level)) {
    return 'mid'
  }

  if (['high', 'severe', 'critical', '1', 'high risk'].includes(level)) {
    return 'high'
  }

  return 'mid'
}

const getFieldErrorText = (error) => (error ? error.message : '')

const FieldIcon = ({ icon: Icon }) => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
    <Icon className="h-5 w-5" />
  </span>
)

const InputShell = ({ label, icon, error, children, htmlFor, helperText }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-2 flex items-center gap-3 text-sm font-semibold text-slate-800">
      <FieldIcon icon={icon} />
      <span>{label}</span>
    </label>
    {children}
 {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
  </div>
)

const MaternalRiskScreening = () => {
  const [prediction, setPrediction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Age: '',
      Systolic_BP: '',
      Diastolic: '',
      BS: '',
      Body_Temp: '',
      BMI: '',
      Previous_Complications: '',
      Preexisting_Diabetes: '',
      Gestational_Diabetes: '',
      Mental_Health: '',
      Heart_Rate: '',
    },
    mode: 'onSubmit',
  })

  const onSubmit = async (values) => {
    setIsLoading(true)

    try {
      const payload = {
        Age: Number(values.Age),
        Systolic_BP: Number(values.Systolic_BP),
        Diastolic: Number(values.Diastolic),
        BS: Number(values.BS),
        Body_Temp: Number(values.Body_Temp),
        BMI: Number(values.BMI),
        Previous_Complications: Number(values.Previous_Complications),
        Preexisting_Diabetes: Number(values.Preexisting_Diabetes),
        Gestational_Diabetes: Number(values.Gestational_Diabetes),
        Mental_Health: Number(values.Mental_Health),
        Heart_Rate: Number(values.Heart_Rate),
      }

      const response = await axios.post(API_URL, payload)
      const responseData = response.data ?? {}
      console.log('API response:', responseData)
      const riskLevel = normalizeRiskLevel(
        responseData.risk_level ?? responseData.riskLevel ?? responseData?.data?.risk_level ?? responseData?.data?.riskLevel ?? responseData?.prediction ?? responseData?.result ?? '',
      )

      setPrediction({
        riskLevel,
        raw: responseData,
      })
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.message ??
        'Unable to generate prediction right now.'

      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const activeRiskLevel = prediction?.riskLevel ?? 'neutral'
  const riskStyles = riskPalette[activeRiskLevel] ?? riskPalette.neutral
  const RiskIcon = riskStyles.icon

  return (
    <div>
      <Header />
      <main className="relative overflow-hidden bg-linear-to-b from-[#fff4fa] via-white to-[#f8f1ff] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute right-0 top-36 h-80 w-80 rounded-full bg-fuchsia-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-rose-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <section className="rounded-[32px] border border-white/80 bg-white/75 p-5 shadow-[0_24px_60px_rgba(88,28,135,0.08)] backdrop-blur-xl sm:p-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
              <RiSparklingLine className="h-4 w-4" />
              AI Screening
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Maternal Risk Screening
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Enter maternal health information to assess risk using AI.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-[30px] border border-slate-100 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-[0_16px_32px_rgba(155,93,229,0.24)]">
                  <RiStethoscopeLine className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-600">Risk Screening Form</p>
                  <h2 className="mt-2 text-xl font-black text-slate-950">Provide all health indicators to generate a prediction</h2>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {fieldGroups.map((field) => {
                  const errorText = getFieldErrorText(errors[field.name])

                  if (field.type === 'select') {
                    return (
                      <InputShell
                        key={field.name}
                        label={field.label}
                        icon={field.icon}
                        error={errorText}
                        htmlFor={field.name}
                        helperText="Choose one option"
                      >
                        <select
                          id={field.name}
                          className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 ${errorText ? 'border-rose-300' : 'border-slate-200'}`}
                          {...register(field.name, {
                            required: `${field.label} is required`,
                          })}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {selectOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </InputShell>
                    )
                  }

                  return (
                    <InputShell key={field.name} label={field.label} icon={field.icon} error={errorText} htmlFor={field.name} helperText={field.placeholder}>
                      <input
                        id={field.name}
                        type={field.type}
                        step="any"
                        placeholder={field.placeholder}
                        className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 ${errorText ? 'border-rose-300' : 'border-slate-200'}`}
                        {...register(field.name, {
                          required: `${field.label} is required`,
                        })}
                      />
                    </InputShell>
                  )
                })}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(155,93,229,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(155,93,229,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? <RiLoader4Line className="h-5 w-5 animate-spin" /> : <RiSparklingLine className="h-5 w-5" />}
                {isLoading ? 'Predicting...' : 'Predict Risk'}
              </button>
            </form>

            <aside className={`overflow-hidden rounded-[30px] border border-slate-100 ${riskStyles.bg} p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-6`}>
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br ${riskStyles.ring} text-white shadow-[0_18px_36px_rgba(124,58,237,0.22)]`}>
                  <RiskIcon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Prediction Result Card</p>
                  <h2 className="mt-2 text-xl font-black text-slate-950">{riskStyles.label}</h2>
                  <p className={`mt-2 text-sm leading-7 ${riskStyles.accent}`}>{riskStyles.description}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <div className={`relative flex h-56 w-56 items-center justify-center rounded-full bg-linear-to-br ${riskStyles.ring} p-3 shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:h-64 sm:w-64`}>
                  <div className="absolute inset-4 rounded-full bg-white/30 blur-[1px]" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/60 bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
                    {prediction ? (
                      <div className="text-center">
                        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${riskStyles.accent}`}>{riskStyles.label}</p>
                        <p className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">{riskStyles.label}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Dynamic risk level from the API response.</p>
                      </div>
                    ) : (
                      <div className="max-w-44 text-center">
                        <RiInformationLine className={`mx-auto h-10 w-10 ${riskStyles.accent}`} />
                        <p className="mt-3 text-lg font-black text-slate-950">No prediction yet</p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Submit the screening form to display the AI result here.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Status</p>
                  <p className={`mt-3 text-lg font-black ${riskStyles.accent}`}>{prediction ? riskStyles.label : 'Awaiting response'}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {prediction ? '' : 'Placeholder state before the first prediction.'}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Description</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{riskStyles.description}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <PregnancyComplicationsSection />
      </div>
      </main>
      <Footer />
    </div>
  )
}

export default MaternalRiskScreening