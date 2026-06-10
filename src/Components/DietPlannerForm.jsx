import { Activity, AlertTriangle, CalendarDays, HeartPulse, Sparkles, Stethoscope, TimerReset, UtensilsCrossed, Scale, ClipboardList } from 'lucide-react'

export const dietPlannerOptions = {
  bmiCategory: [
    { label: 'underweight', value: 'underweight' },
    { label: 'normal_weight', value: 'normal_weight' },
    { label: 'overweight', value: 'overweight' },
    { label: 'obesity', value: 'obesity' },
  ],
  activityLevel: [
    { label: 'mostly_sedentary', value: 'mostly_sedentary' },
    { label: 'moderately_active', value: 'moderately_active' },
    { label: 'physically_demanding', value: 'physically_demanding' },
  ],
  medicalCondition: [
    { label: 'iron_deficiency_anemia', value: 'iron_deficiency_anemia' },
    { label: 'gestational_diabetes', value: 'gestational_diabetes' },
    { label: 'high_blood_pressure_or_preeclampsia', value: 'high_blood_pressure_or_preeclampsia' },
    { label: 'thyroid_disorder', value: 'thyroid_disorder' },
    { label: 'kidney_disease', value: 'kidney_disease' },
    { label: 'food_allergy', value: 'food_allergy' },
    { label: 'severe_nausea_vomiting', value: 'severe_nausea_vomiting' },
    { label: 'multiple_pregnancy', value: 'multiple_pregnancy' },
  ],
  dietaryPreference: [
    { label: 'vegetarian', value: 'vegetarian' },
    { label: 'non_vegetarian', value: 'non_vegetarian' },
  ],
}

export const getDietPlannerLabel = (group, value) => {
  const options = dietPlannerOptions[group] ?? []
  return options.find((option) => option.value === value)?.label ?? value ?? 'Not selected'
}

const fieldStyles = {
  base: 'w-full rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100/70',
  error: 'border-rose-300 focus:border-rose-400 focus:ring-rose-100/70',
}

const labelIconStyles = 'flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-[0_12px_24px_rgba(155,93,229,0.18)]'

const FieldShell = ({ icon: Icon, title, htmlFor, helperText, error, children }) => (
  <div className="space-y-2">
    <label htmlFor={htmlFor} className="flex items-center p-1 gap-3 text-sm font-semibold text-slate-800">
      <span className={labelIconStyles}>
        <Icon className="h-4 w-4" />
      </span>
      <span>{title}</span>
    </label>
  
    {children}
    {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
  </div>
)

const SelectField = ({ id, options, register, validation, error, placeholder }) => (
  <select id={id} className={`${fieldStyles.base} ${error ? fieldStyles.error : ''}`} defaultValue="" aria-invalid={Boolean(error)} {...register(id, validation)}>
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

const DietPlannerForm = ({ register, errors, onSubmit, isSubmitting }) => {
  return (
    <form onSubmit={onSubmit} className="rounded-[32px] border border-white/80 bg-white/75 p-5 shadow-[0_24px_60px_rgba(88,28,135,0.08)] backdrop-blur-xl sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-[0_18px_36px_rgba(155,93,229,0.24)]">
          <Sparkles className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#FF5FA2]">Diet Planner Form</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Tell us about your pregnancy profile</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">The plan adapts to pregnancy stage, health condition, and dietary preference.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FieldShell
          icon={HeartPulse}
          title="Pregnancy Week"
          htmlFor="pregnancy_week"
          helperText="Select the week between 1 and 40."
          error={errors.pregnancy_week?.message}
        >
          <input
            id="pregnancy_week"
            type="number"
            min="1"
            max="40"
            step="1"
            inputMode="numeric"
            placeholder="Enter week"
            aria-invalid={Boolean(errors.pregnancy_week)}
            className={`${fieldStyles.base} ${errors.pregnancy_week ? fieldStyles.error : ''}`}
            {...register('pregnancy_week', {
              required: 'Pregnancy week is required.',
              min: { value: 1, message: 'Week must be at least 1.' },
              max: { value: 40, message: 'Week cannot exceed 40.' },
              valueAsNumber: true,
            })}
          />
        </FieldShell>

        <FieldShell
          icon={Scale}
          title="BMI Category"
          htmlFor="bmi_category"
          helperText="Choose the BMI category that best matches your profile."
          error={errors.bmi_category?.message}
        >
          <SelectField
            id="bmi_category"
            options={dietPlannerOptions.bmiCategory}
            register={register}
            validation={{ required: 'BMI category is required.' }}
            error={errors.bmi_category}
            placeholder="Select BMI category"
          />
        </FieldShell>

        <FieldShell
          icon={Stethoscope}
          title="Age"
          htmlFor="age"
          helperText="Enter the mother’s age."
          error={errors.age?.message}
        >
          <input
            id="age"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            placeholder="Enter age"
            aria-invalid={Boolean(errors.age)}
            className={`${fieldStyles.base} ${errors.age ? fieldStyles.error : ''}`}
            {...register('age', {
              required: 'Age is required.',
              valueAsNumber: true,
            })}
          />
        </FieldShell>

        <FieldShell
          icon={Activity}
          title="Activity Level"
          htmlFor="activity_level"
          helperText="Select the closest activity pattern."
          error={errors.activity_level?.message}
        >
          <SelectField
            id="activity_level"
            options={dietPlannerOptions.activityLevel}
            register={register}
            validation={{ required: 'Activity level is required.' }}
            error={errors.activity_level}
            placeholder="Select activity level"
          />
        </FieldShell>

        <FieldShell
          icon={AlertTriangle}
          title="Medical Condition"
          htmlFor="medical_condition"
          helperText="Choose the closest medical condition if applicable."
          error={errors.medical_condition?.message}
        >
          <SelectField
            id="medical_condition"
            options={dietPlannerOptions.medicalCondition}
            register={register}
            validation={{ required: 'Medical condition is required.' }}
            error={errors.medical_condition}
            placeholder="Select medical condition"
          />
        </FieldShell>

        <FieldShell
          icon={TimerReset}
          title="Dietary Preference"
          htmlFor="dietary_preference"
          helperText="Tell the planner whether your diet is vegetarian or non-vegetarian."
          error={errors.dietary_preference?.message}
        >
          <SelectField
            id="dietary_preference"
            options={dietPlannerOptions.dietaryPreference}
            register={register}
            validation={{ required: 'Dietary preference is required.' }}
            error={errors.dietary_preference}
            placeholder="Select dietary preference"
          />
        </FieldShell>
      </div>

      <div className="mt-6 rounded-[28px] border border-pink-100 bg-linear-to-r from-[#fff6fa] to-[#f7f2ff] p-4 shadow-[0_14px_28px_rgba(155,93,229,0.06)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-700">Generation note</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Your profile is sent to the planner service and the final response is streamed back into the report card.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(155,93,229,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(155,93,229,0.28)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Sparkles className="h-4 w-4" />}
            Generate Diet Plan
          </button>
        </div>
      </div>
    </form>
  )
}

export default DietPlannerForm