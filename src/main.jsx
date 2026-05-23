import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './Pages/Home.jsx';
import Auth from './Pages/Auth.jsx';
import SignUp from './Components/Authentication/SignUp.jsx';
import SignIn from './Components/Authentication/SignIn.jsx';
import ForgotPassword from './Components/Authentication/ForgotPassword.jsx';
import VerifyEmail from './Components/Authentication/VerifyEmail.jsx';
import AuthProvider from './Context/AuthProvider.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
     <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
