import { sendEmailVerification, updateProfile } from 'firebase/auth';
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase/Firebase.init';
import { Eye, EyeOff } from 'lucide-react';

const SignUpDoctor = () => {
        const {
            register,
            handleSubmit,
            getValues,
            formState: { errors },
        } = useForm()
        const {setUser,createUser}=useContext(AuthContext);
        const [load,setLoad]=useState(false);
        const [showPassword, setShowPassword] = useState(false)
        const [showConfirmPassword, setShowConfirmPassword] = useState(false)
        const navigate=useNavigate();
    
        const onSubmit = async(data) => {
            console.log('Form Data:', data)
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
                    role: 'doctor',
                    specialization: data.specialization,
                    experience: data.experience ?? null,

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
    Provide trusted medical guidance and support to mothers through Jotne Maa.
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
               <div className="grid gap-5 md:grid-cols-2">
                
                <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-slate-700">
                       Specialization
                    </label>
                    <select
                        id="specialization"
                        {...register('specialization', {
                            required: 'Specialization is required.'
                        })}
                        className={inputClass}
                    >
                        <option value="">Select your specialization</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Obstetrician">Obstetrician</option>
                        <option value="Pediatrician">Pediatrician</option>
                    </select>
                    {errors.specialization && <p className="mt-1 text-xs text-rose-500">{errors.specialization.message}</p>}
                </div>

                 <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-slate-700">
                        Years of Experience
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            id="experience"
                            placeholder='Enter your Years of Experience'
                            {...register('experience', {
                                required: 'Years of Experience is required.',
                                valueAsNumber: true,
                                min: { value: 0, message: 'Years of Experience must be 0 or greater.' }
                            })}
                            className={`${inputClass} pr-11`}
                        />

                    </div>
                    {errors.experience && <p className="mt-1 text-xs text-rose-500">{errors.experience.message}</p>}
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

export default SignUpDoctor