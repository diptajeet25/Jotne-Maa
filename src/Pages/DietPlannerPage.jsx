import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ShieldCheck, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Header from '../Components/Header.jsx'
import Footer from '../Components/Home/Footer.jsx'
import DietPlannerForm, { getDietPlannerLabel } from '../Components/DietPlannerForm.jsx'
import DietResultCard from '../Components/DietResultCard.jsx'
import useDietPlanner from '../Hooks/useDietPlanner.js'
import { getDietPlannerErrorMessage } from '../Services/dietPlannerApi.js'
import pregnancyDietImage from '../assets/banner.png'


const DietPlannerPage = () => {
  const formRef = useRef(null)
  const resultRef = useRef(null)
  const successTimerRef = useRef(null)
  const dietPlannerMutation = useDietPlanner()
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      pregnancy_week: '',
      bmi_category: '',
      age: '',
      activity_level: '',
      medical_condition: '',
      dietary_preference: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleGenerate = async (values) => {
    const payload = {
      pregnancy_week: Number(values.pregnancy_week),
      bmi_category: values.bmi_category,
      age: Number(values.age),
      activity_level: values.activity_level,
      medical_condition: values.medical_condition,
      dietary_preference: values.dietary_preference,
    }

    await dietPlannerMutation.mutateAsync(payload)
  }

  const handleRetry = async () => {
    const lastPayload = dietPlannerMutation.variables

    if (!lastPayload) {
      scrollToForm()
      return
    }

    await dietPlannerMutation.mutateAsync(lastPayload)
  }

  const submittedProfile = dietPlannerMutation.variables
  const planText = dietPlannerMutation.data?.planText ?? ''
  const errorMessage = dietPlannerMutation.isError ? getDietPlannerErrorMessage(dietPlannerMutation.error) : ''

  const submittedProfileSummary = useMemo(
    () =>
      submittedProfile
        ? {
            pregnancy_week: submittedProfile.pregnancy_week,
            bmi_category: getDietPlannerLabel('bmiCategory', submittedProfile.bmi_category),
            age: submittedProfile.age,
            activity_level: getDietPlannerLabel('activityLevel', submittedProfile.activity_level),
            medical_condition: getDietPlannerLabel('medicalCondition', submittedProfile.medical_condition),
            dietary_preference: getDietPlannerLabel('dietaryPreference', submittedProfile.dietary_preference),
          }
        : null,
    [submittedProfile],
  )

  useEffect(() => {
    if (!dietPlannerMutation.isSuccess) {
      return
    }

    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setShowSuccess(true)

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current)
    }

    successTimerRef.current = window.setTimeout(() => {
      setShowSuccess(false)
    }, 2200)
  }, [dietPlannerMutation.dataUpdatedAt, dietPlannerMutation.isSuccess])

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current)
      }
    }
  }, [])

  const isLoading = dietPlannerMutation.isPending || isSubmitting

  return (
    <div className="bg-[#fff8fd] text-slate-900">
      <Header />

      <main className="relative isolate overflow-hidden px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,rgba(255,95,162,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(155,93,229,0.16),transparent_30%),linear-gradient(180deg,rgba(255,244,250,1),rgba(255,248,253,0.8))]" />
        <div className="pointer-events-none absolute -left-10 top-24 -z-10 h-28 w-28 rounded-full bg-pink-200/30 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute right-10 top-36 -z-10 h-36 w-36 rounded-full bg-violet-200/30 blur-3xl animate-pulse-glow" />

        <section className="mx-auto max-w-7xl space-y-8">
          <div className="relative overflow-hidden rounded-[36px] border border-slate-200/60 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,95,162,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(155,93,229,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))]" />
            <div className="relative grid items-center gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-12">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-pink-600 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  Personalized Nutrition
                </div>

                <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl lg:leading-tight">
                  Personalized Pregnancy Diet Planner
                </h1>

                <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                  Receive a customized nutrition plan tailored to your pregnancy stage, health condition, and dietary preferences.
                </p>

                {/* hero stat cards removed per request */}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(155,93,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(155,93,229,0.3)]"
                  >
                    Start Planning
                    <ArrowDown className="h-4 w-4" />
                  </button>

                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-pink-500" />
                    Safe maternal-health guidance
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="relative flex items-center justify-center lg:justify-end"
              >
                <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-pink-200/25 blur-3xl" />
                <div className="absolute -right-4 bottom-10 h-28 w-28 rounded-full bg-violet-200/20 blur-3xl" />
                <div className="relative flex min-h-[240px] w-full max-w-2xl items-center justify-center overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50 p-6 shadow-[0_12px_24px_rgba(15,23,42,0.04)] lg:max-w-[420px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,95,162,0.08),transparent_55%)]" />
                  <img
                    src={pregnancyDietImage}
                    alt="Pregnant mother illustration used for the diet planner hero"
                    className="relative h-full w-full rounded-[16px] object-cover"
                  />

                  <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-500">Nutrition focus</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">Balanced and personalized</p>
                  </div>

                  <div className="absolute bottom-4 right-4 rounded-2xl bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Trusted care</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">Stage-based recommendations</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <section ref={formRef} className="grid gap-6">
            <DietPlannerForm
              register={register}
              errors={errors}
              isSubmitting={isLoading}
              onSubmit={handleSubmit(handleGenerate)}
            />

            <motion.aside
              ref={resultRef}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
              className="rounded-[32px] border border-white/80 bg-white/75 p-5 shadow-[0_24px_60px_rgba(88,28,135,0.08)] backdrop-blur-xl sm:p-7"
            >
              <DietResultCard
                planText={planText}
                isLoading={dietPlannerMutation.isPending}
                error={errorMessage}
                onRetry={handleRetry}
                showSuccess={showSuccess}
                submittedProfile={submittedProfileSummary}
              />
            </motion.aside>
          </section>

          {/* Result card moved into the right-hand aside above. */}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default DietPlannerPage