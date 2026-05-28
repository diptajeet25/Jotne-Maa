import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import {
  RiAlertLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiFileList3Line,
  RiHeartPulseLine,
  RiInformationLine,
  RiLoader4Line,
  RiSearchLine,
  RiSparklingLine,
  RiStethoscopeLine,
} from 'react-icons/ri'
import Header from '../Components/Header'
import Footer from '../Components/Home/Footer'
import useAxiosSecure from '../Hooks/useAxiosSecure'

const symptomOptions = [
  'Fatigue',
  'Headache',
  'Fever',
  'Anxiety',
  'Depression',
  'Back pain',
  'Vomiting',
  'Dizziness',
  'Shortness of breath',
  'Chest pain',
  'Swelling',
  'Heartburn',
  'Cramps',
  'Spotting',
  'Reduced fetal movement',
  'Blurred vision',
  'Leaking fluid',
  'Persistent vomiting',
  'Urinary pain',
  'Contractions',
]

const ageOptions = Array.from({ length: 38 }, (_, index) => String(index + 18))
const pregnancyStatusOptions = ['Pregnant', 'Postpartum', 'Trying to Conceive']
const trimesterOptions = ['First Trimester', 'Second Trimester', 'Third Trimester']
const severityOptions = ['Mild', 'Moderate', 'Severe', 'Very Severe']
const highlightPills = ['Pregnancy aware', 'AI powered', 'Mobile responsive']

const getResponseRoot = (payload) => payload?.data ?? payload?.result ?? payload?.response ?? payload

const splitList = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.flatMap((item) => splitList(item)).map((item) => item.trim()).filter(Boolean)
  if (typeof value === 'object') {
    const label = value.label ?? value.name ?? value.title ?? value.text ?? value.step ?? ''
    const nested = splitList(value.items ?? value.values ?? value.steps)
    return [String(label).trim(), ...nested].filter(Boolean)
  }
  const text = String(value).trim()
  if (!text) return []
  return text.split(/\n|;|\u2022/).map((item) => item.replace(/^\s*[-•]\s*/, '').trim()).filter(Boolean)
}

const splitSources = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.flatMap(splitSources)
  if (typeof value === 'object') {
    const label = value.label ?? value.name ?? value.title ?? value.text ?? value.source ?? ''
    const url = value.url ?? value.href ?? value.link ?? ''
    return label || url ? [{ label: String(label || url).trim(), url: String(url).trim() }] : []
  }
  const text = String(value).trim()
  if (!text) return []
  return [{ label: text, url: /^https?:\/\//i.test(text) ? text : '' }]
}

const normalizeSymptomResponse = (payload, fallbackSymptom) => {
  const root = getResponseRoot(payload) ?? {}
  const symptomName = String(root.symptom ?? root.symptomName ?? root.title ?? fallbackSymptom ?? '').trim()
  const analysis = String(root.aiAnalysis ?? root.analysis ?? root.summary ?? root.message ?? '').trim()
  const reason = String(root.reason ?? root.description ?? root.cause ?? '').trim()
  const urgencyLevel = String(root.urgencyLevel ?? root.urgency ?? (root.emergency ? 'High' : '') ?? '').trim()
  const careRecommendation = splitList(root.careRecommendation ?? root.recommendation ?? root.treatmentSteps ?? root.steps ?? root.advice)
  const contactDoctor = String(root.whenToContactDoctor ?? root.contactDoctor ?? root.followUp ?? '').trim()
  const sources = splitSources(root.source ?? root.sources ?? root.reference ?? root.references)
  const emergency = Boolean(root.emergency ?? root.isEmergency ?? /high/i.test(urgencyLevel))

  const noResult = root.found === false || payload?.found === false || payload?.success === false || (!analysis && !reason && careRecommendation.length === 0 && !contactDoctor && sources.length === 0 && !urgencyLevel)
  if (noResult) return { status: 'empty', symptomName: fallbackSymptom }

  return {
    status: 'success',
    symptomName: symptomName || fallbackSymptom,
    analysis: analysis || `Analysis for ${symptomName || fallbackSymptom}`,
    reason,
    urgencyLevel: urgencyLevel || (emergency ? 'High' : 'Moderate'),
    careRecommendation,
    contactDoctor,
    emergency,
    sources,
  }
}

const getErrorMessage = (error) => {
  const responseMessage = error?.response?.data?.message ?? error?.response?.data?.error ?? ''
  if (responseMessage) return String(responseMessage)
  if (error?.message) return error.message
  return 'Unable to analyze symptoms right now. Please try again in a moment.'
}

const cardMotion = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }
const listMotion = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const ResultCard = ({ title, icon: Icon, tone = 'soft', children }) => {
  const toneClasses = {
    soft: 'border-pink-100 bg-white/90 shadow-[0_18px_60px_rgba(236,72,153,0.08)]',
    warm: 'border-violet-100 bg-[linear-gradient(180deg,#ffffff_0%,#fff7fd_100%)] shadow-[0_18px_60px_rgba(155,93,229,0.10)]',
    danger: 'border-red-200 bg-[linear-gradient(180deg,#fff4f4_0%,#fffefe_100%)] shadow-[0_18px_60px_rgba(239,68,68,0.14)]',
  }
  const iconClasses = { soft: 'bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white', warm: 'bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white', danger: 'bg-red-100 text-red-600' }

  return (
    <motion.article variants={cardMotion} className={`rounded-4xl border p-5 backdrop-blur-sm transition-all duration-300 sm:p-6 ${toneClasses[tone]}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClasses[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
          <div className="mt-3 text-sm leading-7 text-slate-700">{children}</div>
        </div>
      </div>
    </motion.article>
  )
}

const MarkdownBlock = ({ children, className = '' }) => (
  <div className={`space-y-4 text-sm leading-8 text-slate-700 ${className}`}>
    <ReactMarkdown
      components={{
        h2: (props) => (
          <h2
            className="mt-5 mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-pink-600 first:mt-0"
            {...props}
          />
        ),
        p: (props) => <p className="mb-3 leading-8 text-slate-700 last:mb-0" {...props} />,
        li: (props) => (
          <li
            className="mb-2 ml-5 list-disc leading-8 text-slate-700 marker:text-pink-400"
            {...props}
          />
        ),
        strong: (props) => (
          <strong className="font-semibold text-slate-950" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
)

const StatusPill = ({ emergency }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] ${emergency ? 'bg-red-100 text-red-700' : 'bg-pink-100 text-pink-700'}`}>
    {emergency ? <RiAlertLine className="h-4 w-4" /> : <RiCheckboxCircleLine className="h-4 w-4" />}
    {emergency ? 'Emergency' : 'Monitor and care'}
  </span>
)

const SymptomCheck = () => {
  const axiosSecure = useAxiosSecure()
  const [age, setAge] = useState('28')
  const [pregnancyStatus, setPregnancyStatus] = useState('Pregnant')
  const [trimester, setTrimester] = useState('Second Trimester')
  const [severity, setSeverity] = useState('Moderate')
  const [symptomSearch, setSymptomSearch] = useState('Fatigue')
  const [result, setResult] = useState(null)
  const [formError, setFormError] = useState('')
  const [requestError, setRequestError] = useState('')

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosSecure.post('/symptom-check', payload)
      return response.data
    },
  })

  const filteredSymptoms = symptomOptions.filter((symptom) => symptom.toLowerCase().includes(symptomSearch.toLowerCase()))

  const handleSelectSymptom = (symptom) => {
    setSymptomSearch(symptom)
    setFormError('')
  }

  const handleClear = () => {
    setAge('28')
    setPregnancyStatus('Pregnant')
    setTrimester('Second Trimester')
    setSeverity('Moderate')
    setSymptomSearch('Fatigue')
    setResult(null)
    setFormError('')
    setRequestError('')
    mutation.reset()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const symptom = symptomSearch.trim()

    if (!symptom) {
      setFormError('Please select or search for a symptom before analyzing.')
      setResult(null)
      return
    }

    setFormError('')
    setRequestError('')

    const payload = { age: Number(age), pregnancyStatus, trimester, severity, symptom }

    try {
      const data = await mutation.mutateAsync(payload)
      setResult(normalizeSymptomResponse(data, symptom))
    } catch (error) {
      setResult(null)
      setRequestError(getErrorMessage(error))
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.55),transparent_28%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.38),transparent_28%),linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)] text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-4xl border border-white/80 bg-white/74 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -left-8 top-2 h-36 w-36 rounded-full bg-pink-200/50 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-16 h-44 w-44 rounded-full bg-violet-200/45 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-rose-100/60 blur-3xl" />

          <div className="relative z-10 mb-6 space-y-4">
            <motion.div variants={cardMotion} initial="hidden" animate="show" className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-pink-600 shadow-sm">
              <RiHeartPulseLine className="h-4 w-4" /> Symptom Check
            </motion.div>

            <motion.div variants={cardMotion} initial="hidden" animate="show" className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-black leading-[1.05] text-slate-950 sm:text-4xl lg:text-5xl">
                AI-powered maternal symptom analysis in a calm, professional layout.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Provide a few care details, describe the symptom, and receive a clear response with urgency, recommendation, and when to contact a doctor.
              </p>
            </motion.div>

            <motion.div variants={cardMotion} initial="hidden" animate="show" className="flex flex-wrap gap-3">
              {highlightPills.map((pill) => (
                <span key={pill} className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-600 shadow-sm">
                  {pill}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="relative z-10 space-y-6">
            <section className="rounded-4xl border border-white/75 bg-white/88 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">AI symptom input</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Search or pick a symptom, then analyze it with the patient information below.</p>
                    </div>
                    <div className="hidden rounded-2xl bg-pink-50 p-3 text-pink-600 sm:flex">
                      <RiSparklingLine className="h-5 w-5" />
                    </div>
                  </div>

                  <form id="symptom-check-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="symptom-search" className="text-sm font-semibold text-slate-800">Searchable symptom input</label>
                      <div className="relative">
                        <RiSearchLine className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          id="symptom-search"
                          type="text"
                          value={symptomSearch}
                          onChange={(event) => setSymptomSearch(event.target.value)}
                          placeholder="Fatigue, headache, fever, anxiety..."
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
                          aria-describedby="symptom-help"
                        />
                      </div>
                      <p id="symptom-help" className="text-xs leading-6 text-slate-500">Search from common maternal-health symptoms or type the symptom you want to analyze.</p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white/85 p-3 shadow-sm">
                      <div className="mb-3 flex items-center justify-between gap-3 px-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Suggestions</p>
                        <p className="text-xs text-slate-400">{filteredSymptoms.length} matches</p>
                      </div>

                      <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                        {filteredSymptoms.length ? (
                          filteredSymptoms.map((symptom) => (
                            <button
                              key={symptom}
                              type="button"
                              onClick={() => handleSelectSymptom(symptom)}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                                symptomSearch.toLowerCase() === symptom.toLowerCase()
                                  ? 'border-pink-300 bg-pink-50 text-pink-700'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-pink-200 hover:bg-pink-50/70'
                              }`}
                            >
                              {symptom}
                            </button>
                          ))
                        ) : (
                          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">No symptoms match your search. Try a shorter keyword.</div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <label htmlFor="age" className="text-sm font-semibold text-slate-800">Age</label>
                        <select id="age" value={age} onChange={(event) => setAge(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100">
                          {ageOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="pregnancy-status" className="text-sm font-semibold text-slate-800">Pregnancy Status</label>
                        <select id="pregnancy-status" value={pregnancyStatus} onChange={(event) => setPregnancyStatus(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100">
                          {pregnancyStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="trimester" className="text-sm font-semibold text-slate-800">Pregnancy Trimester</label>
                        <select id="trimester" value={trimester} onChange={(event) => setTrimester(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100">
                          {trimesterOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="severity" className="text-sm font-semibold text-slate-800">Severity Level</label>
                        <select id="severity" value={severity} onChange={(event) => setSeverity(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100">
                          {severityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>
                    </div>

                    {formError ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{formError}</div> : null}
                    {mutation.isPending ? (
                      <div className="rounded-2xl border border-pink-100 bg-white/90 p-4 text-sm text-slate-600 shadow-sm">
                        <div className="flex items-center gap-3">
                          <RiLoader4Line className="h-5 w-5 animate-spin text-pink-500" />
                          <span>Analyzing symptoms with the care engine...</span>
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-center">
                      <button
                        type="button"
                        onClick={handleClear}
                        disabled={mutation.isPending}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                      >
                        <RiCloseLine className="h-5 w-5" /> Clear
                      </button>

                      <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(155,93,229,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(155,93,229,0.26)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:flex-1"
                      >
                        {mutation.isPending ? <RiLoader4Line className="h-5 w-5 animate-spin" /> : <RiArrowRightLine className="h-5 w-5" />}
                        {mutation.isPending ? 'Analyzing symptoms...' : 'Analyze Symptoms'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            <section className="w-full" aria-live="polite">
              {requestError ? (
                <motion.div variants={cardMotion} initial="hidden" animate="show" className="rounded-4xl border border-red-200 bg-red-50/90 p-5 shadow-[0_18px_60px_rgba(239,68,68,0.12)] sm:p-6 lg:p-8">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600"><RiAlertLine className="h-6 w-6" /></div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-600">Error</p>
                      <p className="mt-2 text-sm leading-7 text-red-800">{requestError}</p>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {!result && !requestError && !mutation.isPending ? (
                <motion.div variants={cardMotion} initial="hidden" animate="show" className="rounded-4xl border border-pink-100 bg-white/88 p-5 shadow-[0_18px_60px_rgba(236,72,153,0.08)] sm:p-6 lg:p-8">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600"><RiInformationLine className="h-6 w-6" /></div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">Empty state</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">Fill the patient details and symptom field, then press Analyze Symptoms to see AI guidance.</p>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {result?.status === 'empty' ? (
                <motion.div variants={cardMotion} initial="hidden" animate="show" className="rounded-4xl border border-violet-200 bg-[linear-gradient(180deg,#fffafc_0%,#ffffff_100%)] p-5 shadow-[0_18px_60px_rgba(155,93,229,0.10)] sm:p-6 lg:p-8">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600"><RiSearchLine className="h-6 w-6" /></div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600">No response</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">The backend did not return a matching analysis for <span className="font-semibold text-slate-900">{result.symptomName}</span>. Try a different symptom or severity level.</p>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {result?.status === 'success' ? (
                <motion.div variants={listMotion} initial="hidden" animate="show" className="space-y-4">
                  {result.emergency ? (
                    <ResultCard title="Emergency alert" icon={RiAlertLine} tone="danger">
                      <div className="space-y-3 text-red-900">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
                          <RiAlertLine className="h-4 w-4" /> Seek medical help immediately
                        </span>
                        <p className="leading-7">This response indicates a higher-risk symptom. Please contact your clinician or emergency care immediately.</p>
                      </div>
                    </ResultCard>
                  ) : (
                    <ResultCard title="Calm care status" icon={RiCheckboxCircleLine} tone="warm">
                      <div className="space-y-3 text-slate-700">
                        <StatusPill emergency={false} />
                        <p className="leading-7">The backend treated this as a non-emergency response. Follow the recommendations below and monitor symptoms closely.</p>
                      </div>
                    </ResultCard>
                  )}

                  <ResultCard title="AI analysis" icon={RiStethoscopeLine} tone={result.emergency ? 'danger' : 'soft'}>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Symptom name</p>
                        <p className={`mt-1 text-lg font-black ${result.emergency ? 'text-red-700' : 'text-slate-950'}`}>{result.symptomName}</p>
                      </div>

                      <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5 sm:p-6">
                        <p className="text-sm font-semibold text-slate-500">Analysis</p>

                        <div className="mt-4">
                          <MarkdownBlock>{result.analysis}</MarkdownBlock>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-500">Urgency level</p>
                        <div className="mt-2"><StatusPill emergency={result.emergency} /></div>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{result.urgencyLevel}</p>
                      </div>
                    </div>
                  </ResultCard>



                  <ResultCard title="When to contact doctor" icon={RiInformationLine} tone="soft">
                    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5 sm:p-6">
                      {result.contactDoctor ? (
                        <MarkdownBlock>{result.contactDoctor}</MarkdownBlock>
                      ) : (
                        <p className="leading-8 text-slate-700">
                          {result.emergency
                            ? 'Seek medical help immediately.'
                            : 'Contact your doctor if the symptom worsens, lasts longer than expected, or new warning signs appear.'}
                        </p>
                      )}
                    </div>
                  </ResultCard>

                  <ResultCard title="Source" icon={RiInformationLine} tone="soft">
                    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5 sm:p-6">
                      {result.sources.length ? (
                        <div className="space-y-3">
                          {result.sources.map((source, index) => (
                            <div key={`${source.label}-${index}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm">
                              {source.url ? (
                                <a href={source.url} target="_blank" rel="noreferrer" className="font-medium text-pink-700 underline decoration-pink-200 underline-offset-4 transition hover:text-pink-800">
                                  {source.label}
                                </a>
                              ) : (
                                <span>{source.label}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="leading-8 text-slate-600">Based on the Healthcare Rules of World Health Foundation</p>
                      )}
                    </div>
                  </ResultCard>
                </motion.div>
              ) : null}
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default SymptomCheck