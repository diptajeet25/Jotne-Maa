import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import {
  AlertTriangle,
  BadgeInfo,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  LoaderCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import mentalPic from '../assets/Week/mentalhealth.png'
import Header from '../Components/Header'
import useAxiosSecure from '../Hooks/useAxiosSecure'
import Footer from '../Components/Home/Footer'

const questions = [
  'Little interest or pleasure in doing things?',
  'Feeling down, depressed, or hopeless?',
  'Trouble falling or staying asleep, or sleeping too much?',
  'Feeling tired or having little energy?',
  'Poor appetite or overeating?',
  'Feeling bad about yourself, or that you are a failure or have let yourself or your family down?',
  'Trouble concentrating on things, such as reading the newspaper or watching television?',
  'Moving or speaking so slowly that other people could have noticed? Or being so fidgety or restless that you have been moving around a lot more than usual?',
  'Thoughts that you would be better off dead, or of hurting yourself in some way?',
]

const answerOptions = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
]

const severityVisuals = {
  'Minimal Depression': {
    accent: 'from-emerald-400 to-teal-400',
    icon: CheckCircle2,
  },
  'Mild Depression': {
    accent: 'from-sky-400 to-cyan-400',
    icon: HeartPulse,
  },
  'Moderate Depression': {
    accent: 'from-amber-400 to-orange-400',
    icon: TrendingUp,
  },
  'Moderately Severe Depression': {
    accent: 'from-rose-400 to-pink-500',
    icon: AlertTriangle,
  },
  'Severe Depression': {
    accent: 'from-red-500 to-rose-600',
    icon: ShieldAlert,
  },
}

const heroStats = [
  {
    icon: ShieldCheck,
    title: 'Private & secure',
    text: 'Your answers stay confidential within the browser session.',
  },
  {
    icon: HeartPulse,
    title: 'Scientifically validated',
    text: 'Based on the PHQ-9 depression screening structure.',
  },
  {
    icon: ClipboardList,
    title: 'Instant results',
    text: 'See severity, score, and next-step guidance right away.',
  },
]

const selfHarmOptions = [
  { label: 'No', value: 'No' },
  { label: 'Yes', value: 'Yes' },
]

const socialSupportOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const initialAnswers = Array.from({ length: questions.length }, () => null)
const fallbackQuickAdvice = [
  'Keep a simple daily routine with sleep, meals, and light movement.',
  'Share your feelings with someone you trust instead of staying alone with them.',
  'Reach out to a professional early if symptoms affect your daily life.',
]

const fallbackEmergencyRecommendations = [
  'Contact a trusted person immediately and tell them you need support.',
  'Reach out to emergency mental health support or a crisis hotline right away.',
  'Do not stay alone while these thoughts are active; ask someone to stay with you.',
]

const fallbackSupportRecommendations = [
  'Talk to a trusted family member or friend about how you are feeling.',
  'Consider speaking with a healthcare professional for extra support.',
  'Use small daily check-ins, rest, and gentle routines to reduce stress.',
]

function MentalHealth() {
  const axiosSecure = useAxiosSecure()
  const [answers, setAnswers] = useState(initialAnswers)
  const [selfHarmRisk, setSelfHarmRisk] = useState('')
  const [socialSupport, setSocialSupport] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [showResultView, setShowResultView] = useState(false)
  const resultSectionRef = useRef(null)

  useEffect(() => {
    if (showResultView) {
      resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showResultView])

  const { refetch } = useQuery({
    queryKey: ['mental-health-predict'],
    enabled: false,
    queryFn: async () => {
      try {
        const response = await axiosSecure.post('/predict', {
          answers,
          self_harm_risk: selfHarmRisk,
          social_support: socialSupport,
        })

        return response.data
      } catch (error) {
        return {
          __error: true,
          errorMessage: error?.response?.data?.message ?? 'Unable to generate a prediction right now. Please try again.',
        }
      }
    },
  })

  const completedCount = answers.filter((answer) => answer !== null).length
  const safetyCompletedCount = [selfHarmRisk, socialSupport].filter(Boolean).length
  const totalQuestions = questions.length + 2
  const totalCompletedCount = completedCount + safetyCompletedCount
  const progressPercent = Math.round((totalCompletedCount / totalQuestions) * 100)
  const safetyComplete = selfHarmRisk !== '' && socialSupport !== ''
  const isComplete = completedCount === questions.length && safetyComplete

  const handleAnswerSelect = (questionIndex, value) => {
    setAnswers((currentAnswers) => {
      const nextAnswers = [...currentAnswers]
      nextAnswers[questionIndex] = value
      return nextAnswers
    })
    setResult(null)
    setShowResultView(false)
  }

  const handleSelfHarmRiskChange = (value) => {
    setSelfHarmRisk(value)
    setResult(null)
    setShowResultView(false)
  }

  const handleSocialSupportChange = (value) => {
    setSocialSupport(value)
    setResult(null)
    setShowResultView(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isComplete || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await refetch()
      const apiResponse = response?.data || {}
      const hasApiError = Boolean(response?.error) || Boolean(apiResponse.__error)
      const recommendations = Array.isArray(apiResponse.recommendations)
        ? apiResponse.recommendations
        : apiResponse.recommendations
          ? [apiResponse.recommendations]
          : []

      if (hasApiError) {
        const fallbackRecommendations = selfHarmRisk === 'Yes'
          ? fallbackEmergencyRecommendations
          : socialSupport === 'No'
            ? fallbackSupportRecommendations
            : fallbackQuickAdvice

        setResult({
          score: 0,
          resultTitle: 'Prediction unavailable',
          severity: 'Prediction unavailable',
          guidance: apiResponse.errorMessage ?? 'Unable to generate a prediction right now. Please try again.',
          accent: severityVisuals['Minimal Depression'].accent,
          severityIcon: severityVisuals['Minimal Depression'].icon,
          safetyStatus: 'Prediction unavailable',
          emergencyDetected: false,
          supportDetected: false,
          emergencyWarning: false,
          supportiveGuidanceNeeded: false,
          selfHarmScore: 0,
          recommendations: fallbackRecommendations,
          submissionPayload: {
            self_harm_risk: selfHarmRisk,
            social_support: socialSupport,
            answers,
          },
        })
        setShowResultView(true)

        return
      }

      const severity = apiResponse.severity ?? 'Minimal Depression'
      const visual = severityVisuals[severity] ?? severityVisuals['Minimal Depression']
      const emergencyDetected = Boolean(apiResponse.emergency_detected)
      const supportDetected = Boolean(apiResponse.support_detected)
      const safetyStatus = apiResponse.safety_status ?? (emergencyDetected ? 'High Risk Detected' : supportDetected ? 'Support Needed' : 'Safe')

      setResult({
        score: apiResponse.score ?? 0,
        resultTitle: emergencyDetected
          ? `${severity} with Immediate Safety Concern`
          : supportDetected
            ? `${severity} with Support Needed`
            : severity,
        severity,
        guidance: recommendations[0] ?? 'Review the recommendations below for your next step.',
        accent: visual.accent,
        severityIcon: visual.icon,
        safetyStatus,
        emergencyDetected,
        supportDetected,
        emergencyWarning: emergencyDetected,
        supportiveGuidanceNeeded: supportDetected,
        selfHarmScore: apiResponse.self_harm_score ?? 0,
        recommendations: recommendations.length > 0
          ? recommendations
          : emergencyDetected
            ? fallbackEmergencyRecommendations
            : supportDetected
              ? fallbackSupportRecommendations
              : fallbackQuickAdvice,
        submissionPayload: {
          self_harm_risk: selfHarmRisk,
          social_support: socialSupport,
          answers,
        },
      })
      setShowResultView(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setAnswers(initialAnswers)
    setSelfHarmRisk('')
    setSocialSupport('')
    setResult(null)
    setShowResultView(false)
  }

  const ResultIcon = result?.severityIcon ?? CheckCircle2

  return (
    <div>
      <Header />

      <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.45),transparent_28%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.35),transparent_28%),linear-gradient(180deg,#fff8fd_0%,#ffffff_100%)] text-slate-900">
        <div className="pointer-events-none absolute left-8 top-16 h-32 w-32 rounded-full bg-pink-200/30 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute right-10 top-32 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl animate-pulse-glow" />

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <article className="mt-6 overflow-hidden rounded-4xl border border-white/80 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-pink-600 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Mental Health Screening
              </div>

              <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Mental Health Matters <span className="text-pink-500">💗</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Your well-being matters too. Answer a few questions to understand how you’ve been feeling over the last 2 weeks.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {heroStats.map((item) => {
                  const Icon = item.icon

                  return (
                    <div key={item.title} className="rounded-[22px] border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="relative flex min-h-70 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.12),transparent_60%),linear-gradient(180deg,rgba(250,245,255,0.95),rgba(255,255,255,0.95))] p-6 sm:min-h-80">
              <div className="absolute left-10 top-12 h-24 w-24 rounded-full bg-pink-200/40 blur-2xl" />
              <div className="absolute right-10 top-16 h-24 w-24 rounded-full bg-violet-200/40 blur-2xl" />
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-linear-to-br from-pink-100 via-white to-violet-100 shadow-[0_22px_50px_rgba(236,72,153,0.12)] sm:h-72 sm:w-72 lg:h-80 lg:w-80">
                <div className="flex h-56 w-56 items-center justify-center rounded-full bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)] overflow-hidden">
                  <img src={mentalPic} alt="Mental health illustration" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="mt-6 grid grid-cols-1 gap-6">
          {!showResultView ? (
          <form onSubmit={handleSubmit} className="rounded-[30px] border border-white/80 bg-white/90 p-5 shadow-[0_22px_50px_rgba(15,23,42,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-pink-50 text-pink-600 shadow-sm">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950">Depression Screening (PHQ-9)</h2>
                <p className="mt-1 text-sm text-slate-500">Over the last 2 weeks, how often have you been bothered by the following problems?</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">Questions completed</p>
              <p className="text-sm font-black text-pink-600">
                {totalCompletedCount}/{totalQuestions}
              </p>
            </div>

            <div className="mt-4 h-3 rounded-full bg-pink-100/80">
              <div
                className="h-3 rounded-full bg-linear-to-r from-pink-500 to-violet-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-5 space-y-4">
              {questions.map((question, questionIndex) => {
                const selectedValue = answers[questionIndex]

                return (
                  <article key={question} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-2xl bg-violet-50 text-sm font-black text-violet-600">
                        {questionIndex + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold leading-6 text-slate-950">{question}</h3>

                        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                          {answerOptions.map((option) => {
                            const isSelected = selectedValue === option.value

                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleAnswerSelect(questionIndex, option.value)}
                                className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                                  isSelected
                                    ? 'border-pink-300 bg-pink-50 text-pink-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-pink-200'
                                }`}
                                aria-pressed={isSelected}
                              >
                                <span className="block leading-5">{option.label}</span>
                                <span className="mt-1 block text-[11px] font-normal text-slate-500">Score {option.value}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-5 space-y-4">
              <article className="rounded-3xl border border-red-100 bg-red-50/80 p-4 shadow-sm sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-6 text-slate-950">Are you currently thinking about hurting yourself or ending your life?</h3>
                    <p className="mt-1 text-xs text-slate-500">This question helps identify urgent safety needs.</p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {selfHarmOptions.map((option) => {
                        const isSelected = selfHarmRisk === option.value

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelfHarmRiskChange(option.value)}
                            className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                              isSelected
                                ? 'border-red-300 bg-red-100 text-red-700'
                                : 'border-red-100 bg-white text-slate-700 hover:border-red-200'
                            }`}
                            aria-pressed={isSelected}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-violet-100 bg-violet-50/70 p-4 shadow-sm sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-2xl bg-white text-violet-500 shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-6 text-slate-950">Do you receive enough emotional support from your family or trusted people?</h3>
                    <p className="mt-1 text-xs text-slate-500">Support can make a meaningful difference in recovery and coping.</p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {socialSupportOptions.map((option) => {
                        const isSelected = socialSupport === option.value

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSocialSupportChange(option.value)}
                            className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                              isSelected
                                ? 'border-violet-300 bg-violet-100 text-violet-700'
                                : 'border-violet-100 bg-white text-slate-700 hover:border-violet-200'
                            }`}
                            aria-pressed={isSelected}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-500">
                {isComplete ? 'All questions are answered. Submit to generate your result.' : 'Please answer all 11 questions before submitting.'}
              </p>

              <button
                type="submit"
                disabled={!isComplete || isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-pink-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(236,72,153,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                {isSubmitting ? 'Calculating...' : 'Submit Screening'}
              </button>
            </div>

            <div className="mt-5 rounded-[22px] border border-dashed border-pink-200 bg-pink-50/60 p-4 text-sm leading-6 text-slate-600">
              <p className="font-semibold text-slate-800">Disclaimer</p>
              <p className="mt-1">
                This screening tool does not provide a medical diagnosis. Please consult a healthcare professional.
              </p>
            </div>
          </form>
          ) : showResultView && result ? (
            <article ref={resultSectionRef} className="animate-fade-up rounded-[30px] border border-white/80 bg-white/90 p-5 shadow-[0_22px_50px_rgba(15,23,42,0.08)] sm:p-6">
              <div className={`rounded-[26px] bg-linear-to-r ${result.accent} p-px`}>
                <div className="rounded-[25px] bg-white p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-slate-50 shadow-sm">
                      <ResultIcon className="h-6 w-6 text-pink-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Submit &amp; Advice</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-950">{result.resultTitle ?? result.severity}</h2>
                      <div className="mt-3 space-y-4 text-sm leading-7 text-slate-600">
                        <ReactMarkdown
                          components={{
                            h2: (props) => (
                              <h2
                                className="mt-5 mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-pink-600 first:mt-0"
                                {...props}
                              />
                            ),
                            p: (props) => (
                              <p className="mb-3 leading-7 text-slate-600 last:mb-0" {...props} />
                            ),
                            li: (props) => (
                              <li className="mb-2 ml-5 list-disc leading-7 text-slate-600 marker:text-pink-400" {...props} />
                            ),
                            strong: (props) => (
                              <strong className="font-semibold text-slate-900" {...props} />
                            ),
                          }}
                        >
                          {result.guidance}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[22px] bg-slate-50 p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Total Score</p>
                      <p className="mt-3 text-4xl font-black text-slate-950">{result.score}</p>
                      <p className="mt-1 text-sm text-slate-500">Out of 27</p>
                    </div>
                    <div className="rounded-[22px] bg-slate-50 p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Severity</p>
                      <p className="mt-3 text-xl font-bold text-slate-950">{result.severity}</p>
                      <p className="mt-1 text-sm text-slate-500">PHQ-9 scoring band</p>
                    </div>
                    <div className={`rounded-[22px] p-4 shadow-sm ${result.emergencyDetected ? 'bg-red-50 border border-red-200' : result.supportDetected ? 'bg-violet-50 border border-violet-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Safety Status</p>
                      <p className={`mt-3 text-xl font-bold ${result.emergencyDetected ? 'text-red-700' : result.supportDetected ? 'text-violet-700' : 'text-emerald-700'}`}>
                        {result.safetyStatus}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {result.emergencyDetected
                          ? 'Emergency support is recommended immediately.'
                          : result.supportDetected
                            ? 'Trusted support and professional care may help.'
                            : 'No immediate safety concern detected.'}
                      </p>
                    </div>
                  </div>

                  {result.emergencyDetected ? (
                    <div className="mt-5 rounded-3xl border-2 border-red-300 bg-linear-to-br from-red-50 to-rose-50 p-5 shadow-[0_18px_34px_rgba(239,68,68,0.18)]">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.24em] text-red-700">Emergency warning</p>
                          <p className="mt-2 text-lg font-bold text-red-900">Immediate mental health support is required</p>
                          <p className="mt-2 text-sm leading-7 text-red-800">
                            Because self-harm risk is marked yes or the PHQ-9 self-harm item is above zero, please treat this as urgent.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-[22px] bg-white/80 p-4">
                        <p className="text-sm font-bold text-red-700">Crisis recommendations</p>
                        <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                          {(result.recommendations ?? fallbackEmergencyRecommendations).map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-[22px] bg-pink-50 p-4">
                      <p className="text-sm font-bold text-pink-700">{result.supportDetected ? 'Supportive guidance' : 'Advice for you'}</p>
                      <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                        {(result.recommendations ?? (result.supportDetected ? fallbackSupportRecommendations : fallbackQuickAdvice)).map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-pink-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!result.emergencyDetected && result.supportDetected ? (
                    <div className="mt-5 rounded-[22px] border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-900 shadow-sm">
                      <div className="flex items-start gap-3">
                        <BadgeInfo className="mt-0.5 h-5 w-5 flex-none text-violet-600" />
                        <div>
                          <p className="font-bold">Supportive guidance</p>
                          <p className="mt-1">
                            It may help to lean on a trusted family member, friend, or healthcare professional. You do not have to manage this alone.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {result.emergencyDetected ? (
                    <div className="mt-5 rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800 shadow-sm">
                      <p className="font-bold">Crisis support message</p>
                      <p className="mt-1">
                        Please contact emergency mental health support or a trusted person immediately and do not stay alone.
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                    >
                      <BrainCircuit className="h-4 w-4" />
                      Retake Screening
                    </button>
                  </div>

               
                </div>
              </div>
            </article>
          ) : (
            <article className="rounded-[30px] border border-white/80 bg-white/90 p-5 shadow-[0_22px_50px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-violet-50 text-violet-600 shadow-sm">
                  <BadgeInfo className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-500">Submit &amp; Advice</p>
                  <h2 className="mt-2 text-xl font-black text-slate-950">Complete the screening to see your result</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Once you answer all 9 questions, the result card will show your score, severity, and a short guidance note.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">Helpful reminders</p>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  {(result?.recommendations ?? fallbackQuickAdvice).map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )}

        </section>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default MentalHealth
