import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import Auth from './Pages/Auth.jsx';
import SignUp from './Components/Authentication/SignUp.jsx';
import SignIn from './Components/Authentication/SignIn.jsx';
import ForgotPassword from './Components/Authentication/ForgotPassword.jsx';
import VerifyEmail from './Components/Authentication/VerifyEmail.jsx';
import NotFound from './Pages/NotFound.jsx';
import AuthProvider from './Context/AuthProvider.jsx';
import Emergency from './Pages/Emergency.jsx';
import SymptomCheck from './Pages/SymptomCheck.jsx';
import WeekGuidance from './Pages/WeekGuidance.jsx';
import DailyActivitySuggestion from './Pages/DailyActivitySuggestion.jsx';
import MentalHealth from './Pages/MentalHealth.jsx';
import ChatBot from './Pages/ChatBot.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  
  {
    path: "/emergency",
    element: <Emergency/>,

  },
  {
    path: '/symptom-check',
    element: <SymptomCheck />,
  },
  {
    path:'/auth',
    element:<Auth />,
    children:[
      {
        index:true,
        element:<SignUp />
      },
      {
        path: "signin",
        element: <SignIn />
      }
          ,
          {
            path: "forgot-password",
            element: <ForgotPassword />
          }
          ,
          {
            path: "verify-email",
            element: <VerifyEmail />
          }
    ]
      },
      {
        path: "*",
        element: <NotFound />
  },
  {
    path: "week/:weekNumber",
    element:<WeekGuidance />
  },
  {
    path: '/daily-activity',
    element: <DailyActivitySuggestion />
  },
  {
    path: '/mental-health',
    element: <MentalHealth />
  },
  {
    path: '/chatbot',
    element: <ChatBot />
  }
]);
const queryClient=new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
   <AuthProvider>
     <RouterProvider router={router} />
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
