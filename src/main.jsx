import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import AppLayout from './Components/AppLayout.jsx'
import SignUp from './Components/Authentication/SignUp.jsx'
import SignUpDoctor from './Components/Authentication/SignUpDoctor.jsx'
import SignIn from './Components/Authentication/SignIn.jsx'
import ForgotPassword from './Components/Authentication/ForgotPassword.jsx'
import VerifyEmail from './Components/Authentication/VerifyEmail.jsx'
import AuthProvider from './Context/AuthProvider.jsx'
import PrivateRoute from './Route/PrivateRoute.jsx'
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import Auth from './Pages/Auth.jsx'
import NotFound from './Pages/NotFound.jsx'
import Emergency from './Pages/Emergency.jsx'
import WeekGuidance from './Pages/WeekGuidance.jsx'
import DailyActivitySuggestion from './Pages/DailyActivitySuggestion.jsx'
import MentalHealth from './Pages/MentalHealth.jsx'
import ChatBot from './Pages/ChatBot.jsx'
import MaternalRiskScreening from './Pages/MaternalRiskScreening.jsx'
import ReportAnalyzer from './Pages/ReportAnalyzer.jsx'
import Booking from './Pages/Booking.jsx'
import DoctorAppointmentsDashboard from './Pages/DoctorAppointmentsDashboard.jsx'
import MyAppointments from './Pages/MyAppointments.jsx'
import DietPlannerPage from './Pages/DietPlannerPage.jsx'
import DashboardLayout from './Components/Dashboard/DashboardLayout.jsx'
import DashboardOverview from './Pages/DashboardOverview.jsx'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/emergency',
        element: <Emergency />,
      },
      {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
          {
            index: true,
            element: <DashboardOverview />,
          },
          {
            path: 'diet',
            element: <DietPlannerPage showShell={false} />,
          },
          {
            path: 'mental-health',
            element: <MentalHealth showShell={false} />,
          },
          {
            path: 'report-analyzer',
            element: <ReportAnalyzer showShell={false} />,
          },
          {
            path: 'risk-analyzer',
            element: <MaternalRiskScreening showShell={false} />,
          },
          {
            path: 'doctor-appointments-dashboard',
            element: <DoctorAppointmentsDashboard showShell={false} />,
          },
        ],
      },
      {
        path: '/auth',
        element: <Auth />,
        children: [
          {
            index: true,
            element: <SignUp />,
          },
          {
            path: 'register-doctor',
            element: <SignUpDoctor />,
          },
          {
            path: 'signin',
            element: <SignIn />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
          {
            path: 'verify-email',
            element: <VerifyEmail />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
      {
        path: 'week/:weekNumber',
        element: <PrivateRoute><WeekGuidance /></PrivateRoute>,
      },
      {
        path: '/daily-activity',
        element: <DailyActivitySuggestion />,
      },
      {
        path: '/maternal-risk-screening',
        element: <Navigate to="/dashboard/risk-analyzer" replace />,
      },
      {
        path: '/chatbot',
        element: <PrivateRoute><ChatBot /></PrivateRoute>,
      },
      {
        path: '/report-analyzer',
        element: <Navigate to="/dashboard/report-analyzer" replace />,
      },
      {
        path: '/booking-appointment',
        element:<PrivateRoute><Booking /></PrivateRoute>,
      },
      {
        path: '/doctor-appointments-dashboard',
        element: <Navigate to="/dashboard/doctor-appointments-dashboard" replace />,
      },
      {
        path: '/my-appointments',
        element: <PrivateRoute><MyAppointments /></PrivateRoute>,
      },
      {
        path: '/pregnancy-diet-planner',
        element:<Navigate to="/dashboard/diet" replace />,
      },
    ],
  },
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
