import axios from 'axios'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext';

const baseURL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || 'https://jotnemaa.vercel.app').replace(/\/+$/, '')

const axiosSecure = axios.create({
    baseURL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 15000),
    headers: {
        'Content-Type': 'application/json',
    },
})

const useAxiosSecure = () => {
    const { user, logoutUser } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
            config.headers = config.headers ?? {}
            config.headers.Authorization = user?.accessToken ? `Bearer ${user.accessToken}` : undefined
            config.headers['Content-Type'] = 'application/json'

            return config
        })

        const resInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            (error) => {
                const statusCode = error?.response?.status ?? error?.status

                if (statusCode === 401 || statusCode === 403) {
                    logoutUser().then(() => {
                        navigate('/auth/signin')
                    })
                }

                return Promise.reject(error)
            }
        )

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor)
            axiosSecure.interceptors.response.eject(resInterceptor)
        }
    }, [user, navigate, logoutUser])

    return axiosSecure
}

export default useAxiosSecure