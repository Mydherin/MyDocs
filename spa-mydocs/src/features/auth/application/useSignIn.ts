import { useAuthStore } from '../store/authStore';
import { signInWithBackend } from '../infrastructure/api/authApiAdapter';
import { useGoogleAccessToken } from '../infrastructure/google/useGoogleAccessToken';

export function useSignIn() {
  const { setUser, setLoading, setError } = useAuthStore();

  return useGoogleAccessToken(async ({ accessToken, expiresIn }) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await signInWithBackend(accessToken);
      setUser(user, accessToken, expiresIn);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown_error');
    }
  });
}
