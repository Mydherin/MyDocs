import { useGoogleLogin } from '@react-oauth/google';
import { useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { signInWithBackend } from '../api/authApiAdapter';

const EXPIRY_BUFFER_MS = 60_000;

export function useSilentTokenRefresh() {
  const { accessToken, expiresAt, setUser, signOut } = useAuthStore();

  const silentRefresh = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    prompt: '',
    onSuccess: async (tokenResponse) => {
      try {
        const { user } = await signInWithBackend(tokenResponse.access_token);
        setUser(user, tokenResponse.access_token, tokenResponse.expires_in);
      } catch {
        signOut();
      }
    },
    onError: () => signOut(),
  });

  const refreshIfNeeded = useCallback(() => {
    if (!accessToken || !expiresAt) return;
    if (Date.now() < expiresAt - EXPIRY_BUFFER_MS) return;
    silentRefresh();
  }, [accessToken, expiresAt, silentRefresh]);

  return refreshIfNeeded;
}
