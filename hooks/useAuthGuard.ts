import { useAuth } from '@/app/providers/AuthProvider';
import { router } from 'expo-router';
import { useEffect } from 'react';

export function useAuthGuard() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  return isAuthenticated;
}