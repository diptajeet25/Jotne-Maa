import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'

const KNOWN_SECTIONS = new Set([
  'USER PROFILE',
  'NUTRITION FOCUS',
  'RECOMMENDED FOODS',
  'FOODS TO AVOID',
  'BREAKFAST IDEAS',
  'LUNCH IDEAS',
  'DINNER IDEAS',
  'DIET ADVICE',
  'WARNING NOTES',
  'AI EXPLANATION',
  'TRUSTED SOURCES',
])

const headingToReadable = (heading) =>
  String(heading ?? '')
    .trim()
    .replace(/[:\-]+$/, '')
    .toUpperCase()

const isDividerLine = (line) => /^([=\-_*])\1{5,}$/.test(String(line ?? '').trim())

const IGNORED_HEADINGS = new Set([
  'DIET PLAN',
  'PERSONALIZED PREGNANCY DIET PLAN',
  'END OF REPORT',
])

const isSectionHeading = (line) => {
  const cleaned = headingToReadable(line)

  if (!cleaned || cleaned.length > 80) {
    return false
  }

  if (KNOWN_SECTIONS.has(cleaned)) {
    return true
  }

  return cleaned === line.trim() && /^[A-Z0-9][A-Z0-9\s/&(),.'-]+$/.test(cleaned) && cleaned.split(' ').length <= 6
}

const splitLineItems = (text) => {
  const items = String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const bullets = []
  const paragraphs = []

  for (const item of items) {
    const bulletMatch = item.match(/^(?:[-*•]|\d+[).])\s*(.+)$/)

    if (bulletMatch) {
      bullets.push(bulletMatch[1].trim())
      continue
    }

    paragraphs.push(item)
  }

  return { bullets, paragraphs }
}

const parseDietPlan = (text) => {
  const normalizedLines = String(text ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !isDividerLine(line))

  const sections = []
  let currentSection = null

  for (const line of normalizedLines) {
    if (!line) {
      continue
    }

    if (isSectionHeading(line)) {
      if (currentSection) {
        sections.push(currentSection)
      }

      currentSection = {
        heading: headingToReadable(line),
        lines: [],
      }
      continue
    }

    if (!currentSection) {
      currentSection = {
        heading: 'DIET PLAN',
        lines: [],
      }
    }

    currentSection.lines.push(line)
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections.map((section) => {
    const combinedText = section.lines.join('\n')
    const { bullets, paragraphs } = splitLineItems(combinedText)

    return {
      heading: section.heading,
      bullets,
      paragraphs,
      raw: combinedText,
      type: section.heading.includes('WARNING')
        ? 'warning'
        : section.heading.includes('SOURCE')
          ? 'sources'
          : section.heading.includes('PROFILE')
            ? 'profile'
            : 'content',
    }
  }).filter((section) => {
    if (IGNORED_HEADINGS.has(section.heading)) {
      return false
    }

    return section.heading || section.paragraphs.length > 0 || section.bullets.length > 0
  })
}

const parseSourceItems = (section) => {
  const rawItems = [...section.bullets, ...section.paragraphs]

  return rawItems
    .map((item) => String(item ?? '').trim())
    .filter((item) => item && !/^[\W_]+$/.test(item)) // drop empty or punctuation-only lines
    .map((item) => {
      try {
        const url = new URL(item)
        return {
          label: url.hostname.replace(/^www\./, ''),
          href: url.toString(),
        }
      } catch {
        return {
          label: item,
          href: null,
        }
      }
    })
    .filter((item) => String(item?.label ?? '').trim().length > 0)
}

const FOOD_LIST_SECTIONS = new Set([
  'NUTRITION FOCUS',
  'RECOMMENDED FOODS',
  'FOODS TO AVOID',
  'BREAKFAST IDEAS',
  'LUNCH IDEAS',
  'DINNER IDEAS',
])

const capitalizeFirst = (s) => {
  const str = String(s ?? '')
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const SkeletonBlock = () => (
  <div className="space-y-3 rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
    <div className="h-4 w-28 rounded-full bg-slate-200/80" />
    <div className="space-y-2">
      <div className="h-3 w-full rounded-full bg-slate-100" />
      <div className="h-3 w-11/12 rounded-full bg-slate-100" />
      <div className="h-3 w-10/12 rounded-full bg-slate-100" />
    </div>
  </div>
)

const DietResultCard = ({
  planText,
  isLoading,
  error,
  onRetry,
  showSuccess,
  submittedProfile,
}) => {
  const parsedSections = parseDietPlan(planText)
  const hasContent = parsedSections.length > 0
  const sourceSection = parsedSections.find((section) => section.type === 'sources')
  const sourceItems = sourceSection ? parseSourceItems(sourceSection) : []

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/75 p-5 shadow-[0_24px_60px_rgba(88,28,135,0.08)] backdrop-blur-xl sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,95,162,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(155,93,229,0.08),transparent_26%)]" />
      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">
              <BookOpen className="h-4 w-4" />
              Generated Diet Plan
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Personalized nutrition guidance ready for review
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The planner output is structured into clear sections so mothers can quickly understand meals, warnings, and trusted sources.
            </p>
          </div>

          <AnimatePresence>
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ duration: 0.28 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                Plan generated successfully
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {submittedProfile ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Week', value: submittedProfile.pregnancy_week },
              { label: 'BMI', value: submittedProfile.bmi_category },
              { label: 'Age', value: submittedProfile.age },
              { label: 'Activity', value: submittedProfile.activity_level },
              { label: 'Medical', value: submittedProfile.medical_condition },
              { label: 'Preference', value: submittedProfile.dietary_preference },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{String(item.value ?? '—')}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4" aria-live="polite" aria-busy="true">
              <div className="rounded-[28px] border border-pink-100 bg-pink-50/50 p-4 shadow-sm">
                <div className="flex items-center gap-3 text-sm font-semibold text-pink-700">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Building your personalized diet plan
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">Please wait while the planner streams the final report.</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <SkeletonBlock />
                <SkeletonBlock />
                <SkeletonBlock />
                <SkeletonBlock />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-amber-200 bg-amber-50/80 p-5 shadow-[0_14px_32px_rgba(180,83,9,0.08)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">Unable to generate plan</p>
                  <h3 className="mt-2 text-lg font-bold text-slate-950">The planner service returned an error</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(155,93,229,0.22)] transition hover:-translate-y-0.5"
              >
                <RefreshCcw className="h-4 w-4" />
                Retry generation
              </button>
            </div>
          ) : hasContent ? (
            <div className="space-y-5" aria-live="polite">
              {parsedSections.filter((s) => s.type !== 'profile').map((section) => {
                const Icon =
                  section.type === 'warning'
                    ? AlertTriangle
                    : section.type === 'sources'
                      ? BadgeCheck
                      : CheckCircle2

                return (
                  <article key={section.heading} className="w-full">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm text-[#FF5FA2]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold tracking-tight text-slate-900">{section.heading}</h3>
                        {section.heading !== 'AI EXPLANATION' && section.paragraphs[0] ? <p className="mt-1 text-sm text-slate-600">{section.paragraphs[0]}</p> : null}
                      </div>
                    </div>

                    {section.heading === 'AI EXPLANATION' ? (
                      <div className="mt-6 w-full space-y-4 text-base leading-8 text-slate-700">
                        {section.paragraphs.map((p, idx) => (
                          <p key={`${section.heading}-p-${idx}`}>{p}</p>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {section.type === 'sources' ? (
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {sourceItems.map((item) =>
                              item.href ? (
                                <a
                                  key={`${item.label}-${item.href}`}
                                  href={item.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white/95 px-4 py-3 text-sm text-slate-800 hover:shadow-sm"
                                >
                                  <span className="truncate">{item.label}</span>
                                  <ArrowRight className="h-4 w-4 text-violet-600" />
                                </a>
                              ) : (
                                <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white/95 px-4 py-3 text-sm text-slate-800">
                                  <span className="truncate">{item.label}</span>
                                </div>
                              ),
                            )}
                          </div>
                        ) : section.bullets.length > 0 ? (
                          <ul className={`grid gap-2 ${FOOD_LIST_SECTIONS.has(section.heading) ? 'sm:grid-cols-4' : 'sm:grid-cols-2'}`}>
                            {section.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-white/95 px-4 py-3">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#9B5DE5]" />
                                <span className="text-sm text-slate-700">{FOOD_LIST_SECTIONS.has(section.heading) ? capitalizeFirst(bullet) : bullet}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        {section.type === 'warning' && section.paragraphs.length > 0 ? (
                          <div className="mt-2 text-sm text-slate-700">
                            {section.paragraphs.map((p) => (
                              <p key={p} className="mb-2">{p}</p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}

                    <hr className="my-6 border-t border-slate-100" />
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
              <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-pink-600">
                    <Sparkles className="h-4 w-4" />
                    Ready when you are
                  </div>
                  <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">Your customized meal plan will appear here</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    Fill in the form, generate the plan, and the result will be organized into nutrition focus, suggested meals, warnings, and trusted sources.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    'Stage-aware nutrition',
                    'Condition-sensitive guidance',
                    'Preference-based meals',
                    'Evidence-led sources',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-100 bg-linear-to-br from-white to-slate-50 px-4 py-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-800">{item}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Personalized output from the planner service.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default DietResultCard