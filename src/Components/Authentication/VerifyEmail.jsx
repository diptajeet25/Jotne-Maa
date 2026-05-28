import { sendEmailVerification } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../Firebase/Firebase.init'
import { AuthContext } from '../../Context/AuthContext'

const VerifyEmail = () => {

  const navigate = useNavigate();
  const {logoutUser}=useContext(AuthContext);
  const [resendLoading, setResendLoading] = useState(false);
  const handleResend=async()=>
  {
    setResendLoading(true);
    console.log(auth.currentUser);
    try{
      await sendEmailVerification(auth.currentUser,{
          url:`${window.location.origin}/auth/signin`,
          handleCodeInApp:false

      });
      alert('Verification email sent! Please check your inbox.');
     

    }catch(error)
    {
      console.error('Error sending verification email:', error);
      alert('Failed to resend verification email. Please try again later.');


    }
    finally{
       setResendLoading(false);
    }
  }

  useEffect(() => {
      const interval = setInterval(async () => {
        if (!auth.currentUser) {
          navigate('/auth/signin');
          return;
        }

        await auth.currentUser.reload();

        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          const verifiedEmail = auth.currentUser.email;
          if (verifiedEmail) {
              await logoutUser();

              navigate('/auth/signin');
          }
        
       
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [navigate, logoutUser]);

  

  return (
    <div>
      <p className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-pink-600">
        Email Verification
      </p>

      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Verify Your Email</h1>
      <p className="mt-2 text-sm text-slate-500 sm:text-base">We sent a link to confirm your address — this helps keep your account secure.</p>

      <div className="mt-8 max-w-xl">
        <div className="rounded-xl border border-pink-50 bg-white/60 p-6 shadow-sm">
         

          <div className="mt-2 flex flex-col gap-3">
            <span className="text-sm text-slate-500">If you don't see the email, please check your spam folder or junk mail.</span>
           

            
            

            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="w-full rounded-xl bg-linear-to-r from-[#ff5fa2] to-[#9b5de5] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(155,93,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(155,93,229,0.3)] disabled:cursor-not-allowed disabled:bg-pink-300 disabled:shadow-none"
            >
              {resendLoading ? 'Resending...' : 'Resend Verification Email'}
            </button>

            <div className="text-center">
              <Link to="/auth/signin" className="text-sm font-medium text-pink-600 hover:underline">
                Back to Sign In
              </Link>
            </div>

            <div className="rounded-xl bg-pink-50/70 px-4 py-3 text-center text-sm text-slate-600">
              If you don’t receive an email, you can contact support at <span className="font-medium">support@example.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
