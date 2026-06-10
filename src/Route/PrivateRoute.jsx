import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)]">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-ring loading-lg text-primary" />
          <p className="text-lg font-semibold text-slate-600 animate-pulse">
            Please wait...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />
  }

  return children
}

export default PrivateRoute