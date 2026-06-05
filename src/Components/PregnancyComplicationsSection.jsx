import { useEffect, useMemo, useRef, useState } from 'react'
import {
  RiAlertLine,
  RiArrowLeftLine,
  RiErrorWarningLine,
  RiFileList3Line,
  RiHeartPulseLine,
  RiHospitalLine,
  RiInformationLine,
  RiLoader4Line,
  RiMedicineBottleLine,
  RiSearchLine,
  RiShieldCrossLine,
  RiSyringeLine,
} from 'react-icons/ri'

const INITIAL_VISIBLE_COUNT = 10

const HIGH_RISK_CONDITIONS = new Set([
  'Pre-eclampsia',
  'Severe Pre-eclampsia',
  'Eclampsia',
  'HELLP Syndrome',
  'Placental Abruption',
  'Placenta Previa',
  'Postpartum Haemorrhage (PPH)',
  'Uterine Rupture',
  'Cord Prolapse',
])

const MEDIUM_RISK_CONDITIONS = new Set([
  'Gestational Hypertension',
  'Gestational Diabetes Mellitus',
  'Preterm Labour',
  'PPROM',
  'PROM',
  'Polyhydramnios',
  'Oligohydramnios',
  'Premature Rupture of Membranes (PROM)',
  'Preterm Premature Rupture of Membranes (PPROM)',
])

const normalizeText = (value) => String(value ?? '').trim().toLowerCase()

const getRiskLevel = (conditionName) => {
  if (HIGH_RISK_CONDITIONS.has(conditionName)) {
    return 'high'
  }

  if (MEDIUM_RISK_CONDITIONS.has(conditionName)) {
    return 'medium'
  }

  return 'low'
}

const riskStyles = {
  high: {
    label: 'High Risk',
    badge: 'border-rose-200 bg-rose-100 text-rose-700',
    dot: 'bg-rose-500',
    card: 'border-rose-200 bg-rose-50',
  },
  medium: {
    label: 'Medium Risk',
    badge: 'border-amber-200 bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
    card: 'border-amber-200 bg-amber-50',
  },
  low: {
    label: 'Low Risk',
    badge: 'border-emerald-200 bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    card: 'border-emerald-200 bg-emerald-50',
  },
}

const DetailListCard = ({ title, icon: Icon, items, fallbackText, tone = 'slate' }) => {
  const toneMap = {
    slate: 'border-slate-100 bg-white',
    pink: 'border-pink-100 bg-pink-50/40',
    violet: 'border-violet-100 bg-violet-50/40',
    rose: 'border-rose-100 bg-rose-50/50',
    amber: 'border-amber-100 bg-amber-50/50',
    emerald: 'border-emerald-100 bg-emerald-50/50',
  }

  const safeItems = Array.isArray(items)
    ? items.map((item) => String(item).trim()).filter(Boolean)
    : String(items ?? '').trim()
      ? [String(items).trim()]
      : []

  return (
    <article className={`rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${toneMap[tone] ?? toneMap.slate}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">{title}</h4>
          {safeItems.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
              {safeItems.map((item, index) => (
                <li key={`${title}-${index}`} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[#9B5DE5]" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-500">{fallbackText}</p>
          )}
        </div>
      </div>
    </article>
  )
}

const PregnancyComplicationsSection = () => {
  const [complications, setComplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [selectedComplication, setSelectedComplication] = useState(null)
  const detailRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const loadComplications = async () => {
      setIsLoading(true)
      setError('')

      try {
        const dataUrls = [ '/pregnancy_complications_41.json']
        let safeArray = null
        let lastError = null

        for (const url of dataUrls) {
          try {
            const response = await fetch(url, { cache: 'no-store' })

            if (!response.ok) {
              continue
            }

            const textPayload = await response.text()

            if (!textPayload.trim()) {
              continue
            }

            const parsed = JSON.parse(textPayload)

            if (Array.isArray(parsed)) {
              safeArray = parsed
              break
            }
          } catch (innerError) {
            lastError = innerError
          }
        }

        if (!safeArray) {
          throw lastError ?? new Error('Failed to load complications data.')
        }

        if (!isMounted) {
          return
        }

        setComplications(safeArray)
      } catch (fetchError) {
        if (!isMounted) {
          return
        }

        setError(fetchError?.message ?? 'Unable to load complications right now.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadComplications()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredComplications = useMemo(() => {
    const query = normalizeText(searchTerm)

    if (!query) {
      return complications
    }

    return complications.filter((item) => {
      const conditionName = normalizeText(item?.condition_name)
      const symptoms = Array.isArray(item?.symptoms)
        ? item.symptoms.map((symptom) => normalizeText(symptom)).join(' ')
        : ''

      return conditionName.includes(query) || symptoms.includes(query)
    })
  }, [complications, searchTerm])

  const visibleComplications = showAll
    ? filteredComplications
    : filteredComplications.slice(0, INITIAL_VISIBLE_COUNT)

  const remainingCount = Math.max(filteredComplications.length - INITIAL_VISIBLE_COUNT, 0)

  const handleSelectComplication = (item) => {
    setSelectedComplication(item)

    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleBackFromDetail = () => {
    setSelectedComplication(null)
  }

  const selectedRiskLevel = getRiskLevel(selectedComplication?.condition_name)
  const selectedRiskStyle = riskStyles[selectedRiskLevel]

  return (
    <section className="mt-4 rounded-2xl border border-white/80 bg-white/80 p-3 shadow-[0_18px_40px_rgba(88,28,135,0.06)] backdrop-blur-sm sm:p-5">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">
            <RiHospitalLine className="h-4 w-4" />
            Clinical Reference
          </span>
          <h2 className="mt-4 text-2xl font-black text-slate-950 ">
            Common Complications Related to Maternal Risk
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Click any complication to learn about its symptoms, risks, treatment and emergency warning signs.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 shadow-sm">
          {complications.length} Complications Available
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-100 bg-white p-2 shadow-sm sm:p-3">
        <label className="relative block">
          <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setShowAll(false)
            }}
            placeholder="Search by condition or symptoms"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-50"
          />
        </label>
      </div>

      {isLoading ? (
        <div className="mt-6 flex items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="inline-flex items-center gap-3 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
            <RiLoader4Line className="h-5 w-5 animate-spin" />
            Loading complications...
          </div>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
          <p className="font-semibold">Unable to load complications data.</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleComplications.map((item, index) => {
              const globalIndex = filteredComplications.findIndex(
                (entry) => entry?.condition_name === item?.condition_name,
              )
              const cardNumber = globalIndex >= 0 ? globalIndex + 1 : index + 1

              return (
                <article
                  key={`${item?.condition_name}-${cardNumber}`}
                  className="group rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-[0_12px_22px_rgba(155,93,229,0.12)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-sm">
                      <RiHeartPulseLine className="h-4 w-4" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">#{cardNumber}</span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold leading-6 text-slate-900 sm:text-base">
                    {item?.condition_name ?? 'Unknown Condition'}
                  </h3>

                  <button
                    type="button"
                    onClick={() => handleSelectComplication(item)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-pink-600 transition group-hover:border-pink-300 group-hover:bg-pink-100"
                  >
                    <RiFileList3Line className="h-4 w-4" />
                    View Details
                  </button>
                </article>
              )
            })}
          </div>

          {filteredComplications.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 text-sm text-slate-600 shadow-sm">
              No complications matched your search.
            </div>
          ) : null}

          {filteredComplications.length > INITIAL_VISIBLE_COUNT ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((previous) => !previous)}
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(155,93,229,0.16)] transition hover:-translate-y-0.5"
              >
                {showAll ? 'Show Less' : `See More (${remainingCount} More Complications)`}
              </button>
            </div>
          ) : null}

          {selectedComplication ? (
            <div
              ref={detailRef}
              className="mt-6 animate-fade-up rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-5"
            >
              <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackFromDetail}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                    aria-label="Back"
                  >
                    <RiArrowLeftLine className="h-4 w-4" />
                  </button>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Selected Complication</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950 sm:text-xl">
                      {selectedComplication?.condition_name}
                    </h3>
                  </div>
                </div>

              </div>


              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                <DetailListCard
                  title="Definition"
                  icon={RiInformationLine}
                  items={selectedComplication?.definition}
                  fallbackText="Definition details are not available."
                  tone="violet"
                />

                <DetailListCard
                  title="Common Symptoms"
                  icon={RiHeartPulseLine}
                  items={selectedComplication?.symptoms}
                  fallbackText="No symptoms listed."
                  tone="pink"
                />

                <DetailListCard
                  title="Severe / Danger Signs"
                  icon={RiAlertLine}
                  items={selectedComplication?.severe_symptoms}
                  fallbackText="No severe signs listed."
                  tone="rose"
                />

                <DetailListCard
                  title="Risks"
                  icon={RiShieldCrossLine}
                  items={selectedComplication?.risks}
                  fallbackText="No risk factors listed."
                  tone="amber"
                />

                <DetailListCard
                  title="Treatment / Management"
                  icon={RiMedicineBottleLine}
                  items={selectedComplication?.treatment}
                  fallbackText="No treatment details listed."
                  tone="emerald"
                />

                <DetailListCard
                  title="Urgent Referral Needed If"
                  icon={RiSyringeLine}
                  items={selectedComplication?.urgent_referral_needed_if}
                  fallbackText="No urgent referral criteria listed."
                  tone="rose"
                />
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}

export default PregnancyComplicationsSection