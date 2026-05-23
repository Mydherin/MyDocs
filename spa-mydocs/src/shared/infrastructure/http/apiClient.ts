import { useAuthStore } from '../../../features/auth/store/authStore';
import { useWorkspaceStore } from '../../../features/workspaces/store/workspaceStore';

const API_URL = import.meta.env.VITE_API_URL as string;

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { accessToken } = useAuthStore.getState();
  const { activeWorkspaceId } = useWorkspaceStore.getState();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if (activeWorkspaceId) headers['X-Workspace-Id'] = activeWorkspaceId;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'unknown_error' })) as { error: string };
    throw new Error(error.error ?? 'unknown_error');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
