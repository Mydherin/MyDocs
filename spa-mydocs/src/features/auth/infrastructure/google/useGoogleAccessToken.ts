import { useGoogleLogin } from '@react-oauth/google';

export function useGoogleAccessToken(onSuccess: (token: string) => void) {
  return useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: (tokenResponse) => onSuccess(tokenResponse.access_token),
    onError: () => console.error('Google login failed'),
  });
}
