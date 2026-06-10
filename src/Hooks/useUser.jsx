import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../Context/AuthContext';
import useAxiosSecure from './useAxiosSecure';

const useUser = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useContext(AuthContext);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/role?email=${user.email}`);
      return res.data;
    },
  });

  return {
    userData: data,
    isLoading,
    refetch,
  };
};

export default useUser;