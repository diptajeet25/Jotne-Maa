import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../Context/AuthContext'
import { auth } from '../../Firebase/Firebase.init'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'

const SignUp = () => {
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm()
    const {setUser,createUser}=useContext(AuthContext);
    const [load,setLoad]=useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [pregnancyStatus, setPregnancyStatus] = useState('')
    const navigate=useNavigate();

    const showDueDate = pregnancyStatus === 'Pregnant'
    const showBirthDate = pregnancyStatus === 'Postpartum'
    const showDateField = showDueDate || showBirthDate

    const handleStatusChange = (event) => {
        const selectedStatus = event.target.value
        setPregnancyStatus(selectedStatus)

        if (selectedStatus !== 'Pregnant') {
            setValue('dueDate', '')
            clearErrors('dueDate')
        }

        if (selectedStatus !== 'Postpartum') {
            setValue('birthDate', '')
            clearErrors('birthDate')
        }
    }

    const onSubmit = async(data) => {
        setLoad(true);
        const { email, password } = data
        try {
            await  createUser(email,password)
    setUser(auth.currentUser);
     const profile={
                displayName:data.name,   
            }
    await updateProfile(auth.currentUser,profile)
    

    localStorage.setItem(
            "pendingUser",
            JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone,
                pregnancyStatus: data.status,
                dueDate: data?.dueDate || null,
                birthDate: data?.birthDate || null,

            })
        );

        await sendEmailVerification(auth.currentUser,{
                          url:`${window.location.origin}/auth/signin`,
                          handleCodeInApp:false
                      })
                  
        alert('Verification email sent! Please check your inbox and verify your email before signing in.')
        navigate('/auth/verify-email')  
        }catch(error)
        {
            if (error?.code === 'auth/email-already-in-use') {
                        alert('This email is already registered. Please use another email or log in.');
                    } else {
                        alert('Registration failed. Please try again.');
                    }
        }
        finally
        {
            setLoad(false);

        }
          
    }

    const inputClass =
        'mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100'

  return (
    <div>
        <p className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-pink-600">
            Join Jotne Maa
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Create Your Account</h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Start your personalized motherhood journey with Jotne Maa.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    placeholder='Enter your Full Name'
                    {...register('name', { required: true })}
                    className={inputClass}
                />
                {errors.name && <p className="mt-1 text-xs text-rose-500">Full Name is required.</p>}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder='Enter your Email'
                        {...register('email', { required: true })}
                        className={inputClass}
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-500">Email is required.</p>}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        placeholder='Enter your Phone Number'
                        {...register('phone', { required: true })}
                        className={inputClass}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-rose-500">Phone Number is required.</p>}
                </div>
            </div>

            <div className={`grid ${showDateField ? 'gap-5 md:grid-cols-2' : 'gap-0 md:grid-cols-1'}`}>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                        Pregnancy Status
                    </label>
                    <select
                        id="status"
                        {...register('status', {
                            required: true,
                            onChange: handleStatusChange,
                        })}
                        className={inputClass}
                    >
                        <option value="">Select your status</option>
                        <option value="Planning">Planning to Conceive</option>
                        <option value="Pregnant">Currently Pregnant</option>
                        <option value="Postpartum">Postpartum</option>
                    </select>
                    {errors.status && <p className="mt-1 text-xs text-rose-500">Pregnancy Status is required.</p>}
                </div>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${showDateField ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1'}`}
                    aria-hidden={!showDateField}
                >
                    {showDueDate && (
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">
                                Expected Due Date
                            </label>
                            <input
                                type="date"
                                id="dueDate"
                                placeholder='Enter your Expected Due Date'
                                {...register('dueDate', {
                                    required: showDueDate ? 'Expected Due Date is required.' : false,
                                })}
                                className={inputClass}
                            />
                            {errors.dueDate && <p className="mt-1 text-xs text-rose-500">{errors.dueDate.message}</p>}
                        </div>
                    )}

                    {showBirthDate && (
                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-slate-700">
                                Baby Birth Date
                            </label>
                            <input
                                type="date"
                                id="birthDate"
                                placeholder='Enter your Baby Birth Date'
                                {...register('birthDate', {
                                    required: showBirthDate ? 'Baby Birth Date is required.' : false,
                                })}
                                className={inputClass}
                            />
                            {errors.birthDate && <p className="mt-1 text-xs text-rose-500">{errors.birthDate.message}</p>}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder='Enter your Password'
                            {...register('password', {
                                required: 'Password is required.',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters.',
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*(\d|[^A-Za-z0-9])).+$/,
                                    message: 'Password must include a letter and a number or special character.',
                                },
                            })}
                            className={`${inputClass} pr-11`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            placeholder="Re-enter your Password"
                            {...register('confirmPassword', {
                                required: 'Confirm Password is required.',
                                validate: (value) =>
                                    value === getValues('password') || 'Passwords do not match.',
                            })}
                            className={`${inputClass} pr-11`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword.message}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="w-full rounded-xl bg-linear-to-r from-[#ff5fa2] to-[#9b5de5] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(155,93,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(155,93,229,0.3)]"
            >
                {load ? ` Creating Account...` : 'Create Account'}
            </button>
            <span className="block text-center text-sm text-slate-500">
                Already have an account? <a href="/auth/signin" className="text-pink-600 hover:underline">Sign In</a>
            </span>
        </form>
    </div>
  )
}

export default SignUp