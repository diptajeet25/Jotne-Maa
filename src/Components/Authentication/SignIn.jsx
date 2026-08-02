import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import { auth } from '../../Firebase/Firebase.init'
import { signOut } from 'firebase/auth'
import { Eye, EyeOff } from 'lucide-react'
import useAxiosSecure from '../../Hooks/useAxiosSecure'
import showToast from '../../utils/showToast'

const SignIn = () => {
    
    const {register, handleSubmit, formState: { errors }} = useForm()
    const [submitted, setSubmitted] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const {loginUser}=useContext(AuthContext);
    const axiosSecure=useAxiosSecure();
    const onSubmit=async(data)=>
    {
        setSubmitted(true);
        try{
            console.log(data);
            console.log(auth.currentUser);
           
            await loginUser(data.email,data.password);
             if(!auth.currentUser?.emailVerified)
            {
                await showToast('Please verify your email before signing in. Check your inbox for the verification email.', 'warning');
                await signOut(auth);
                return;
            }

            const existingUser=await axiosSecure.get(`/users?email=${data.email}`);
            console.log(existingUser.data.exists);

            if(existingUser.data.exists===false)
            {
                const userData=localStorage.getItem('pendingUser')
                const parsedData=JSON.parse(userData);
                await axiosSecure.post('/users',parsedData);
                console.log('User created successfully.');
                
                localStorage.removeItem('pendingUser');
            }
            navigate('/');
            await showToast('Sign in successful! Welcome back to Jotne Maa.', 'success')
        }
        catch(error)
        {


              if (error.code === 'auth/invalid-credential') {
        await showToast('Invalid email or password.', 'error');
    }
    else if (error.code === 'auth/user-not-found') {
        await showToast('No user found with this email.', 'error');
    }
    else if (error.code === 'auth/wrong-password') {
        await showToast('Incorrect password.', 'error');
    }


            if(error.response && error.response.status===404)
            {
                await showToast('No user found with this email. Please sign up first.', 'error');
                navigate('/auth');
                return;
            }

        }
        finally{
            setSubmitted(false);
        }
    }



      const inputClass =
        'mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100'
  return (
   <div>
        <p className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-pink-600">
            Welcome Back
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Sign In to Your Account</h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Continue your personalized motherhood journey with Jotne Maa.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
           

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
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder='Enter your Password'
                            {...register('password', { required: true })}
                            className={`${inputClass} pr-11`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-pink-600"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-rose-500">Password is required.</p>}
                </div>

                <div className="flex items-center justify-end">
                    <Link
                        to="/auth/forgot-password"
                        className="text-sm font-medium text-pink-600 transition hover:text-pink-700 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>

             
            

            <button
                type="submit"
                disabled={submitted}
                className="w-full rounded-xl bg-linear-to-r from-[#ff5fa2] to-[#9b5de5] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(155,93,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(155,93,229,0.3)]"
            >
               {submitted ? 'Signing In...' : 'Sign In'}
            </button>

          

            <span className="block text-center text-sm text-slate-500">
              Don't have an account? <Link to="/auth" className="text-pink-600 hover:underline">Sign Up</Link>
            </span>
        </form>
    </div>
  )
}

export default SignIn