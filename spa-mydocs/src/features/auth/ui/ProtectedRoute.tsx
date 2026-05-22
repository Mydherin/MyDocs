import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSilentTokenRefresh } from '../infrastructure/google/useSilentTokenRefresh';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const refreshIfNeeded = useSilentTokenRefresh();

  useEffect(() => {
    refreshIfNeeded();
  }, [refreshIfNeeded]);

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
