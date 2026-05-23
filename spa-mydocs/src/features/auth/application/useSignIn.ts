import { useAuthStore } from '../store/authStore';
import { signInWithBackend } from '../infrastructure/api/authApiAdapter';
import { useGoogleAccessToken } from '../infrastructure/google/useGoogleAccessToken';
import { getWorkspaces } from '../../workspaces/infrastructure/api/workspaceApiAdapter';
import { useWorkspaceStore } from '../../workspaces/store/workspaceStore';

export function useSignIn() {
  const { setUser, setLoading, setError } = useAuthStore();
  const setWorkspaces = useWorkspaceStore((s) => s.setWorkspaces);

  return useGoogleAccessToken(async ({ accessToken, expiresIn }) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await signInWithBackend(accessToken);
      setUser(user, accessToken, expiresIn);
      const workspaces = await getWorkspaces();
      setWorkspaces(workspaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown_error');
    }
  });
}
