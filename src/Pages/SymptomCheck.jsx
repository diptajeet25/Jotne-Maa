import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Baby,
  BadgeInfo,
  BookOpenText,
  Check,
  ChevronRight,
  CircleAlert,
  FileText,
  HeartPulse,
  Hospital,
  LoaderCircle,
  Search,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react'
import Header from '../Components/Header.jsx'
import Footer from '../Components/Home/Footer.jsx'

const API_URL = 'https://tahamina1116keya-jotne-maa.hf.space/gradio_api/api/maternal_report'

const stageOptions = [
  { id: 'pregnancy', label: 'Pregnancy', description: 'Screen symptoms during pregnancy.', icon: HeartPulse },
  { id: 'postpartum', label: 'Postpartum', description: 'Check symptoms after delivery.', icon: Baby },
  { id: 'breastfeeding', label: 'Breastfeeding', description: 'Monitor symptoms while nursing your baby.', icon: Sparkles },
]

const trimesterOptions = [
  { id: 'first trimester', label: 'First Trimester', description: 'Early pregnancy care and symptom tracking.', icon: ChevronRight },
  { id: 'second trimester', label: 'Second Trimester', description: 'Monitor the mid-pregnancy phase.', icon: Check },
  { id: 'third trimester', label: 'Third Trimester', description: 'Focus on late pregnancy warning signs.', icon: AlertTriangle },
  { id: 'postpartum', label: 'Postpartum', description: 'Use this when the care phase is after birth.', icon: Baby },
]

const sectionDefinitions = [
  { key: 'possibleCondition', patterns: [/^possible condition\b/i, /^possible diagnosis\b/i] },
  { key: 'matchingScore', patterns: [/^matching score\b/i, /^match score\b/i, /^score\b/i] },
  { key: 'medicalAdvice', patterns: [/^medical advice\b/i, /^retrieved medical advice\b/i, /^medical recommendation\b/i, /^recommended care\b/i] },
  { key: 'emergencyWarningSigns', patterns: [/^when to seek immediate help\b/i, /^emergency warning signs\b/i, /^immediate help\b/i] },
  { key: 'whyThisAdviceWasGiven', patterns: [/^why this advice was given\b/i, /^why this advice\b/i] },
  { key: 'trustedSources', patterns: [/^trusted sources\b/i, /^sources\b/i, /^references\b/i] },
]

const splitSymptomInput = (value) =>
  String(value ?? '')
    .split(/\n|,|;|\/|\band\b/i)
    .map((item) => item.replace(/^[-•*\s]+/, '').trim())
    .map((item) => item.replace(/\s+/g, ' '))
    .filter(Boolean)

const titleCaseText = (value) =>
  String(value ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const dedupeSymptoms = (items) => {
  const seen = new Set()
  const result = []

  items.forEach((item) => {
    const normalized = String(item ?? '').trim().replace(/\s+/g, ' ')
    if (!normalized) return

    const key = normalized.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    result.push(titleCaseText(normalized))
  })

  return result
}

const detectSectionKey = (line) => {
  const cleaned = line.replace(/^[•*\-\s]+/, '').trim()
  const matched = sectionDefinitions.find(({ patterns }) => patterns.some((pattern) => pattern.test(cleaned)))
  return matched?.key ?? null
}

const extractInlineValue = (line) => {
  const cleaned = line.replace(/^[•*\-\s]+/, '').trim()
  const separators = [':', ' - ', ' — ', ' – ']

  for (const separator of separators) {
    const index = cleaned.indexOf(separator)
    if (index >= 0) {
      let value = cleaned.slice(index + separator.length).trim()
      if (value) return removeInlineTrailingSections(value)
    }
  }

  return ''
}

const removeInlineTrailingSections = (text) => {
  const headings = ['retrieved medical advice', 'medical advice', 'when to seek immediate help', 'emergency warning signs', 'why this advice was given', 'trusted sources', 'possible condition', 'matching score']
  const lower = String(text ?? '').toLowerCase()
  let cutIndex = -1

  for (const h of headings) {
    const idx = lower.indexOf(h)
    if (idx >= 0) {
      if (cutIndex === -1 || idx < cutIndex) cutIndex = idx
    }
  }

  if (cutIndex >= 0) {
    return String(text).slice(0, cutIndex).trim().replace(/[,:\-\s]+$/,'')
  }

  return text
}

const cleanSectionLines = (lines) => lines.map((line) => line.trim()).filter((line) => line && !/^[=-]{3,}$/.test(line))

const safeHostname = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const parseSourceItems = (sectionText) => {
  const lines = cleanSectionLines(String(sectionText ?? '').split('\n'))
  if (!lines.length) return []

  const items = []

  for (const rawLine of lines) {
    const line = rawLine.trim()

    // Stop parsing trusted sources if a Disclaimer heading appears
    if (/^disclaimer\b[:\s-]?/i.test(line)) break

    const urls = line.match(/https?:\/\/[^\s)]+/g) ?? []

    if (!urls.length) {
      // ignore very short lines that are likely headings or noise
      if (line.length >= 5) items.push({ label: line, url: '' })
      continue
    }

    urls.forEach((url) => {
      const label = line.replace(url, '').replace(/^[•*\-\d.\s]+/, '').replace(/[:\-–—\s]+$/, '').trim()

      items.push({
        label: label || safeHostname(url),
        url,
      })
    })
  }

  return items.filter((item) => item.label || item.url)
}

const parseReportText = (reportText) => {
  const rawText = String(reportText ?? '').replace(/\r\n/g, '\n').trim()
  const lines = rawText.split('\n')
  const headings = []

  lines.forEach((line, index) => {
    const key = detectSectionKey(line)
    if (key) headings.push({ key, index })
  })

  const sections = headings.reduce((accumulator, current, index) => {
    const nextIndex = headings[index + 1]?.index ?? lines.length
    const block = lines.slice(current.index, nextIndex)
    const [firstLine, ...restLines] = block
    const inlineValue = extractInlineValue(firstLine)
    const cleanedBody = cleanSectionLines(restLines)
    const value = [inlineValue, ...cleanedBody].filter(Boolean).join('\n').trim()

    accumulator[current.key] = value || ''
    return accumulator
  }, {})

  return {
    rawText,
    emergencyDetected: /\b(immediate help|emergency|danger sign)\b/i.test(rawText),
    possibleCondition: sections.possibleCondition || '',
    matchingScore: sections.matchingScore || '',
    medicalAdvice: sections.medicalAdvice || '',
    emergencyWarningSigns: sections.emergencyWarningSigns || '',
    whyThisAdviceWasGiven: sections.whyThisAdviceWasGiven || '',
    trustedSources: parseSourceItems(sections.trustedSources || ''),
  }
}

const splitLines = (text) =>
  String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^[=-]{3,}$/.test(line))

const formatParagraphText = (text) =>
  cleanSectionLines(String(text ?? '').split('\n'))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

const splitSafetyNote = (text) => {
  const normalized = String(text ?? '').replace(/\r\n/g, '\n').trim()

  if (!normalized) {
    return { explanation: '', safetyNote: '' }
  }

  const parts = normalized.split(/SAFETY NOTE:\s*/i)

  if (parts.length < 2) {
    return { explanation: normalized, safetyNote: '' }
  }

  return {
    explanation: formatParagraphText(parts[0].replace(/[:\s-]+$/, '')),
    safetyNote: formatParagraphText(parts.slice(1).join('SAFETY NOTE:')),
  }
}

const extractScoreValue = (text) => {
  const match = String(text ?? '').match(/\d+(?:\.\d+)?/)
  return match?.[0] ?? String(text ?? '').trim()
}

const splitNumberedList = (text) => {
  const s = String(text ?? '').replace(/\r\n/g, '\n').trim()
  if (!s) return []

  // Try splitting on common numbered markers like "1)" or "1."
  const numbered = s.split(/\s*(?:\d+\)|\d+\.)\s*/).map((p) => p.trim()).filter(Boolean)
  if (numbered.length > 1) return numbered

  // Fallback to paragraph/newline splitting
  return s.split(/\n+/).map((p) => p.trim()).filter(Boolean)
}

const normalizeApiText = (payload) => {
  if (typeof payload === 'string') return payload
  if (Array.isArray(payload)) return payload.map((item) => String(item ?? '')).join('\n')
  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.data)) return String(payload.data[0] ?? '')
    if (typeof payload.data === 'string') return payload.data
    if (typeof payload.message === 'string') return payload.message
  }
  return ''
}

const buildCandidateUrls = (base) => {
  try {
    const u = new URL(base)
    const origin = u.origin
    return [
      base,
      `${origin}/run/predict`,
      `${origin}/run/predict/`,
      `${origin}/api/predict`,
      `${origin}/api/predict/`,
      `${origin}/api/maternal_report`,
      `${origin}/gradio_api/api/maternal_report`,
    ]
  } catch {
    return [base]
  }
}

const getErrorMessage = (error) => {
  if (error?.name === 'AbortError') return 'The request timed out. Please try again.'
  if (error?.message === 'Failed to fetch') return 'Unable to reach the service. Please check your network connection.'
  return error?.message || 'Unable to analyze symptoms right now. Please try again.'
}

const cardMotion = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

const staggerMotion = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const ResultCard = ({ icon: Icon, title, subtitle, tone = 'soft', children }) => {
  const toneClasses = {
    soft: 'border-white/80 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)]',
    warm: 'border-pink-100 bg-[linear-gradient(180deg,#ffffff_0%,#fff7fd_100%)] shadow-[0_20px_70px_rgba(236,72,153,0.08)]',
    danger: 'border-red-200 bg-[linear-gradient(180deg,#fff5f5_0%,#ffffff_100%)] shadow-[0_20px_70px_rgba(239,68,68,0.12)]',
  }

  const iconClasses = {
    soft: 'bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white',
    warm: 'bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white',
    danger: 'bg-red-100 text-red-600',
  }

  return (
    <motion.article variants={cardMotion} className={`rounded-[28px] border p-5 backdrop-blur-sm sm:p-6 ${toneClasses[tone]}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClasses[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
          {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
          <div className="mt-4 text-sm leading-7 text-slate-700">{children}</div>
        </div>
      </div>
    </motion.article>
  )
}

const Chip = ({ children, onRemove, tone = 'default' }) => {
  const toneClasses = {
    default: 'border-pink-100 bg-pink-50 text-pink-700',
    subtle: 'border-slate-200 bg-white text-slate-700',
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${toneClasses[tone]}`}>
      <span>{children}</span>
      {onRemove ? (
        <button type="button" onClick={onRemove} className="inline-flex h-5 w-5 items-center justify-center rounded-full text-current transition hover:bg-black/5" aria-label={`Remove ${children}`}>
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  )
}

const SelectionCard = ({ label, description, icon: Icon, selected, onClick }) => (
  <motion.button
    type="button"
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className={`group flex h-full w-full flex-col items-start rounded-3xl border p-4 text-left transition-all duration-200 sm:p-5 ${selected ? 'border-pink-300 bg-[linear-gradient(180deg,#fff0f7_0%,#ffffff_100%)] shadow-[0_16px_40px_rgba(236,72,153,0.12)]' : 'border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/40'}`}
    aria-pressed={selected}
  >
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${selected ? 'bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-pink-100 group-hover:text-pink-600'}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="mt-3 min-w-0 flex-1">
      <p className="text-sm font-semibold text-slate-900 sm:text-lg sm:leading-tight">{label}</p>
      <p className="mt-2 max-w-none text-[11px] leading-4 text-slate-500 sm:text-xs">{description}</p>
    </div>
  </motion.button>
)

const SymptomCheck = () => {
  const [stage, setStage] = useState('')
  const [trimester, setTrimester] = useState('')
  const [symptomInput, setSymptomInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [formError, setFormError] = useState('')
  const [parsedReport, setParsedReport] = useState(null)

  const resultRef = useRef(null)

  const enteredSymptoms = useMemo(() => dedupeSymptoms(splitSymptomInput(symptomInput)), [symptomInput])

  const whyAdviceSections = useMemo(() => splitSafetyNote(parsedReport?.whyThisAdviceWasGiven), [parsedReport])

  const handleRemoveSymptom = (symptom) => {
    const nextSymptoms = enteredSymptoms.filter((item) => item.toLowerCase() !== symptom.toLowerCase())
    setSymptomInput(nextSymptoms.join(', '))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const finalSymptoms = enteredSymptoms

    if (!stage) {
      setFormError('Please choose a pregnancy stage.')
      return
    }

    if (!trimester) {
      setFormError('Please choose a trimester or postpartum phase.')
      return
    }

    if (!finalSymptoms.length) {
      setFormError('Please add at least one symptom before analyzing.')
      return
    }

    setLoading(true)
    setFormError('')
    setRequestError('')

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 30000)

    try {
      const candidateUrls = buildCandidateUrls(API_URL)
      let lastError = null
      let payload = null

      for (const url of candidateUrls) {
        const payloadBodies = [
          { data: [finalSymptoms.join(', '), stage, trimester] },
          { data: [finalSymptoms.join(', '), stage, trimester], fn_index: 0 },
        ]

        for (const body of payloadBodies) {
          const maxAttempts = 3
          let attempt = 0
          let shouldBreak = false

          while (attempt < maxAttempts && !payload) {
            try {
              console.log('Attempting request to', url, 'attempt', attempt + 1, 'with body', body)
              const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal,
              })

              console.log('Response from', url, response.status, response.statusText)

              if (!response.ok) {
                const status = response.status
                const errorText = await response.text().catch(() => '')

                // Retry on server errors (5xx), otherwise record and stop trying this URL/body
                if (status >= 500 && attempt < maxAttempts - 1) {
                  console.warn(`Server error ${status} from ${url}, retrying...`)
                  attempt += 1
                  await new Promise((r) => setTimeout(r, 500 * attempt))
                  continue
                }

                lastError = new Error(errorText || `Request to ${url} failed with status ${status}.`)
                break
              }

              try {
                payload = await response.json()
              } catch (e) {
                const text = await response.text().catch(() => '')
                payload = text
              }

              console.log('API request succeeded at', url)
              shouldBreak = true
            } catch (err) {
              lastError = err
              // network or abort — retry unless controller aborted
              if (err?.name === 'AbortError') {
                console.warn('Request aborted')
                break
              }

              if (attempt < maxAttempts - 1) {
                console.warn('Transient error, retrying:', err.message)
                attempt += 1
                await new Promise((r) => setTimeout(r, 500 * attempt))
                continue
              }

              break
            }
          }

          if (shouldBreak || payload) break
        }

        if (payload) break
      }

      if (!payload) {
        throw lastError || new Error('All requests failed.')
      }

      const reportText = normalizeApiText(payload)
      console.log('Raw API response:', payload)
      console.log('Parsed report text:', reportText)

      if (!reportText || !reportText.trim()) {
        throw new Error('The service returned an empty report.')
      }

      setParsedReport(parseReportText(reportText))
    } catch (error) {
      setParsedReport(null)
      setRequestError(getErrorMessage(error))
    } finally {
      window.clearTimeout(timeoutId)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!parsedReport && !requestError) return
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [parsedReport, requestError])

  const sources = parsedReport?.trustedSources ?? []

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.55),transparent_26%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.4),transparent_26%),linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)] text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-4xl border border-white/80 bg-white/70 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-pink-200/50 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-24 h-52 w-52 rounded-full bg-violet-200/45 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-rose-100/60 blur-3xl" />

          <div className="relative z-10 mb-6 space-y-4">
            <motion.div variants={cardMotion} initial="hidden" animate="show" className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-pink-600 shadow-sm">
              <Sparkles className="h-4 w-4" /> Symptom Assessment
            </motion.div>

            <motion.div variants={cardMotion} initial="hidden" animate="show" className="space-y-3">
              <h1 className="max-w-4xl text-3xl font-black leading-[1.05] text-slate-950 sm:text-4xl lg:text-5xl">
                Maternal symptom assessment with a calm, professional dashboard layout.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Choose the care stage, add one or more symptoms, then review the plain-text maternal health report in structured cards.
              </p>
            </motion.div>

            <motion.div variants={cardMotion} initial="hidden" animate="show" className="flex flex-wrap gap-3">
              {['Professional review', 'Stage + trimester', 'Structured results'].map((pill) => (
                <span key={pill} className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-600 shadow-sm">
                  {pill}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <motion.section variants={cardMotion} initial="hidden" animate="show" className="rounded-[30px] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">Build your symptom report</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">Complete the assessment in three steps</h2>
                </div>
                <div className="hidden rounded-2xl bg-pink-50 p-3 text-pink-600 sm:flex">
                  <BadgeInfo className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <section className="rounded-[28px] border border-slate-100 bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">Enter Your Details</p>
                        <h3 className="mt-2 text-xl font-black text-slate-950">1. Symptoms Reported *</h3>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[26px] border border-pink-200 bg-white p-3 shadow-sm">
                      <textarea
                        value={symptomInput}
                        onChange={(event) => setSymptomInput(event.target.value)}
                        placeholder="Type your symptoms here, separated by commas."
                        rows={9}
                        className="min-h-72 w-full resize-none rounded-[18px] border border-pink-200 bg-white p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                      />

                      <div className="mt-2 flex items-center justify-end text-xs text-slate-400">
                        {symptomInput.length} / 500
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {enteredSymptoms.length ? (
                        enteredSymptoms.map((symptom) => (
                          <Chip key={symptom} onRemove={() => handleRemoveSymptom(symptom)}>
                            {symptom}
                          </Chip>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">Add one or more symptoms to continue.</span>
                      )}
                    </div>
                  </section>

                  <section className="space-y-5">
                    <div className="rounded-[28px] border border-slate-100 bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                          <HeartPulse className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">Maternal Stage</p>
                          <h3 className="mt-2 text-xl font-black text-slate-950">2. Maternal Stage *</h3>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {stageOptions.map((option) => (
                          <SelectionCard
                            key={option.id}
                            label={option.label}
                            description={option.description}
                            icon={option.icon}
                            selected={stage === option.id}
                            onClick={() => {
                              setStage(option.id)
                              setFormError('')
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-100 bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                          <BadgeInfo className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">Trimester</p>
                          <h3 className="mt-2 text-xl font-black text-slate-950">3. Trimester <span className="text-sm font-semibold text-slate-500">(Optional)</span></h3>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {trimesterOptions.map((option) => (
                          <SelectionCard
                            key={option.id}
                            label={option.label}
                            description={option.description}
                            icon={option.icon}
                            selected={trimester === option.id}
                            onClick={() => {
                              setTrimester(option.id)
                              setFormError('')
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(155,93,229,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(155,93,229,0.28)] disabled:cursor-not-allowed disabled:opacity-75"
                    >
                      {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                      {loading ? 'Analyzing symptoms...' : 'Analyze Symptoms'}
                    </button>

                    <div className="rounded-[22px] border border-rose-100 bg-rose-50/70 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-white p-2 text-rose-500 shadow-sm">
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <p className="text-sm leading-7 text-slate-600">
                          <span className="font-semibold text-slate-800">Important:</span> This tool is for informational purposes only and is not a substitute for professional medical advice. Please consult a qualified healthcare professional for proper diagnosis and treatment.
                        </p>
                      </div>
                    </div>
                  </section>

                <AnimatePresence>
                  {formError ? (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      {formError}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

              </form>
            </motion.section>

            <section ref={resultRef} className="space-y-4 lg:sticky lg:top-24">
              <AnimatePresence mode="wait">
                {requestError ? (
                  <motion.div key="request-error" variants={cardMotion} initial="hidden" animate="show" exit="hidden" className="rounded-[28px] border border-red-200 bg-red-50/90 p-5 shadow-[0_20px_60px_rgba(239,68,68,0.12)] sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                        <CircleAlert className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-600">Analysis Error</p>
                        <p className="mt-2 text-sm leading-7 text-red-800">{requestError}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}

                {loading ? (
                  <motion.div key="loading-state" variants={cardMotion} initial="hidden" animate="show" exit="hidden" className="rounded-[28px] border border-pink-100 bg-white/88 p-5 shadow-[0_20px_60px_rgba(236,72,153,0.08)] sm:p-6">
                    <div className="flex items-center gap-3 text-slate-700">
                      <LoaderCircle className="h-5 w-5 animate-spin text-pink-500" />
                      <span className="text-sm font-medium">Analyzing symptoms...</span>
                    </div>
                  </motion.div>
                ) : null}

                {!requestError && !loading && !parsedReport ? (
                  <motion.div key="empty-state" variants={cardMotion} initial="hidden" animate="show" exit="hidden" className="rounded-[28px] border border-pink-100 bg-white/88 p-5 shadow-[0_20px_60px_rgba(236,72,153,0.08)] sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">Analysis Result</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">The report will appear here after you analyze symptoms.</p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}

                {parsedReport ? (
                  <motion.div key="report-state" variants={staggerMotion} initial="hidden" animate="show" exit="hidden" className="space-y-4">
                    <motion.div variants={cardMotion} className="rounded-[28px] border border-slate-100 bg-white/88 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Report Summary</p>
                          <h3 className="mt-2 text-lg font-black text-slate-900">Patient details & quick summary</h3>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                              <p className="text-xs text-slate-500">Stage</p>
                              <p className="mt-1 font-semibold text-slate-800">{titleCaseText(stage) || '—'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                              <p className="text-xs text-slate-500">Trimester</p>
                              <p className="mt-1 font-semibold text-slate-800">{titleCaseText(trimester) || '—'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="hidden shrink-0 rounded-2xl bg-white/70 p-3 text-pink-500 sm:flex">
                          <HeartPulse className="h-12 w-12" />
                        </div>
                      </div>
                    </motion.div>
                    <motion.div variants={cardMotion} className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#f5fff8_0%,#ffffff_100%)] p-5 shadow-[0_20px_60px_rgba(34,197,94,0.08)] sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Possible Condition</p>
                          <h2 className="mt-3 text-3xl font-black text-pink-600 sm:text-4xl">
                            {parsedReport.possibleCondition || 'Not clearly specified'}
                          </h2>

                         
                        </div>

                        <div className="hidden shrink-0 rounded-2xl bg-white/70 p-3 text-pink-500 sm:flex">
                          <Baby className="h-12 w-12" />
                        </div>
                      </div>
                    </motion.div>

                    <ResultCard icon={FileText} title="Symptoms Reported" tone="soft">
                      <ul className="space-y-2">
                        {enteredSymptoms.length ? (
                          enteredSymptoms.map((symptom) => (
                            <li key={symptom} className="flex items-start gap-2 text-sm leading-7 text-slate-700">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-pink-500" />
                              <span>{symptom}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-600">No symptoms entered yet.</li>
                        )}
                      </ul>
                    </ResultCard>

                    <ResultCard icon={Sparkles} title="Medical Advice" tone="soft">
                      {splitLines(parsedReport.medicalAdvice).length ? (
                        <ol className="space-y-3 pl-5">
                          {splitLines(parsedReport.medicalAdvice).map((line) => (
                            <li key={line} className="text-sm leading-7 text-slate-700">
                              {line}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="leading-7 text-slate-600">No medical advice was returned.</p>
                      )}
                    </ResultCard>

                    <ResultCard icon={AlertTriangle} title="When to Seek Immediate Help" tone="danger">
                      {splitLines(parsedReport.emergencyWarningSigns).length ? (
                        <ol className="space-y-3 pl-5">
                          {splitLines(parsedReport.emergencyWarningSigns).map((line) => (
                            <li key={line} className="text-sm leading-7 text-red-800">
                              {line}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="leading-7 text-red-700">No separate emergency warning signs were returned.</p>
                      )}
                    </ResultCard>

                    <ResultCard icon={FileText} title="Clinical Rationale" tone="soft">
                      <div className="space-y-4">
                        {(() => {
                          const items = splitNumberedList(whyAdviceSections.explanation)
                          if (items.length) {
                            return (
                              <ol className="list-decimal pl-5">
                                {items.map((item, idx) => (
                                  <li key={`${idx}-${item}`} className="text-sm leading-7 text-slate-700 mb-2">
                                    {item}
                                  </li>
                                ))}
                              </ol>
                            )
                          }

                          return <p className="max-w-none leading-7 text-slate-700">No explanation was returned.</p>
                        })()}

                        {whyAdviceSections.safetyNote ? (
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                              <CircleAlert className="h-4 w-4" />
                              Safety Note
                            </div>
                            <p className="mt-3 leading-7 text-amber-950/90">{whyAdviceSections.safetyNote}</p>
                          </div>
                        ) : null}
                      </div>
                    </ResultCard>

                    <ResultCard icon={BookOpenText} title="Trusted Sources" tone="soft">
                      {sources.length ? (
                        <div className="space-y-3">
                          {sources.map((source) => (
                            <div key={`${source.label}-${source.url}`} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                              <p className="text-sm font-semibold text-slate-900">{source.label}</p>
                              {source.url ? (
                                <a href={source.url} target="_blank" rel="noreferrer" className="mt-1 block break-all text-xs leading-5 text-pink-600 hover:text-pink-700">
                                  {source.url}
                                </a>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="leading-7 text-slate-600">No trusted sources were returned in the report.</p>
                      )}
                    </ResultCard>

                    <motion.div variants={cardMotion} className="rounded-[22px] border border-slate-100 bg-white/92 p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Disclaimer</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">This is not a medical diagnosis. Please consult a qualified healthcare professional for definitive care.</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="rounded-[28px] border border-slate-100 bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[linear-gradient(180deg,#fff0f7_0%,#ffffff_100%)] text-pink-500 shadow-sm">
                      <Baby className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-pink-600">Need Medical Assistance?</p>
                      <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">
                        If you are experiencing a medical emergency or need immediate help, consult nearby specialist doctors.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <Link
                      to="/booking-appointment"
                      className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(155,93,229,0.22)] transition hover:-translate-y-0.5"
                    >
                      <Hospital className="h-4 w-4" />
                      Book Doctor Consultation
                    </Link>
                    <p className="text-xs font-medium text-slate-500">Available 24/7 for your health support</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default SymptomCheck