import axios from 'axios';
import { useContext, useEffect } from 'react';

import { useNavigate } from 'react-router';
import { AuthContext } from '../Context/AuthContext';


const axiosSecure=axios.create({
    baseURL:"https://jotnemaa.vercel.app"


})

const useAxiosSecure = () => {
  const {user,logoutUser}=useContext(AuthContext)
  const navigate=useNavigate();
  useEffect(()=>
  {
       const reqInterceptor =axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user?.accessToken}`;

            
            return config
      })
 const resInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            

            const statusCode = error.status;
            if (statusCode === 401 || statusCode === 403) {
                logoutUser()
                    .then(() => {
                        navigate('/auth/login')
                    })
            }


            return Promise.reject(error);
        })



      return ()=>
      {
          axiosSecure.interceptors.request.eject(reqInterceptor);
                      axiosSecure.interceptors.response.eject(resInterceptor);


      }

  },[user,navigate,logoutUser])
  return axiosSecure;
};

export default useAxiosSecure;