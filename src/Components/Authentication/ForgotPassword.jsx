import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../Firebase/Firebase.init'

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const onSubmit = async (data) => {
    setServerError('')
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: `${window.location.origin}/auth/signin`,
      })
      setSubmitted(true)
    } catch (err) {
      console.error('sendPasswordResetEmail error', err)
      setServerError(err?.message || 'Unable to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100'

  return (
    <div>
      <p className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-pink-600">
        Reset Password
      </p>

      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Forgot your password?</h1>
      <p className="mt-2 text-sm text-slate-500 sm:text-base">
        Enter the email associated with your account and we'll send a secure reset link.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-xl border border-pink-50 bg-pink-50/40 p-6">
          <p className="text-sm text-slate-700">Check your inbox — we sent password reset instructions to your email. If you don't see it, check spam or try again.</p>
          <div className="mt-4 flex gap-3">
            <Link to="/auth/signin" className="text-sm font-medium text-pink-600 hover:underline">Back to Sign In</Link>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input id="email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email' } })} className={inputClass} />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
            {serverError && <p className="mt-2 text-sm text-rose-600">{serverError}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-linear-to-r from-[#ff5fa2] to-[#9b5de5] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(155,93,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(155,93,229,0.3)]">
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>

          <div className="text-center">
            <Link to="/auth/signin" className="text-sm font-medium text-slate-600 hover:underline">Back to Sign In</Link>
          </div>

          <p className="rounded-xl bg-pink-50/70 px-4 py-3 text-center text-sm text-slate-600">
            If you don’t receive an email, you can contact support at <span className="font-medium">support@jotne-maa.example</span>
          </p>
        </form>
      )}
    </div>
  )
}

export default ForgotPassword
