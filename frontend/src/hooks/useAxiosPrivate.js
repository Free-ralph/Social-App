import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import axios, { axiosPrivate } from '../api/axios';
import { AuthStateContext } from '../context/AuthProvider';

const useAxiosPrivate = () => {
    const { auth } = AuthStateContext();
    const refresh = useRefreshToken();
    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers.Authorization && !config.sent) {
                    config.headers.Authorization = `Bearer ${auth?.access}`;
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                // if we failded due to an expired/faulty token
                // sent is to signify that we've attempted this before, if it doesn't exit or is false, it simply means 
                // this is our first attempt to refresh, then we set it to true
                // so we don't end up in an infinite loop,
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newToken = await refresh();
                    prevRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosPrivate(prevRequest);
                }
                // if even after the refresh attempt it fails, we reject it, meaning our refreshs token is probably 
                // expired
                
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        }
    }, [])
    return axiosPrivate
}

export default useAxiosPrivate