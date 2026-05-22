import type { User } from '../../domain/model/User';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface SignInResult {
  user: User;
  isNew: boolean;
}

export async function signInWithBackend(accessToken: string): Promise<SignInResult> {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json() as { error: string };
    throw new Error(error.error ?? 'sign_in_failed');
  }

  const user = await response.json() as User;
  return { user, isNew: response.status === 201 };
}
