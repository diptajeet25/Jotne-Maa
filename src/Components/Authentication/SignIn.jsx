import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import { auth } from '../../Firebase/Firebase.init'
import { useNavigate } from 'react-router'

const SignIn = () => {
    
    const {register, handleSubmit, formState: { errors }} = useForm()
    const [submitted, setSubmitted] = useState(false)
    const navigate = useNavigate();
    const {loginUser,logoutUser}=useContext(AuthContext);
  const onSubmit = async (data) => {

    try {
        setSubmitted(true);
        const result = await loginUser(
            data.email,
            data.password
        );

        await result.user.reload();
        console.log(auth.currentUser);

        if (!result.user.emailVerified) {
            await logoutUser();

            alert("Please verify your email first.");

            return 
        }

        alert("Signed in successfully!");

        navigate('/');

    } catch (error) {

        console.log(error);

        alert(error.message);

    } finally {

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
                    <input
                        type="password"
                        id="password"
                        placeholder='Enter your Password'
                        {...register('password', { required: true })}
                        className={inputClass}
                    />
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