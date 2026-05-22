import { useGoogleLogin } from '@react-oauth/google';

export interface GoogleTokenResult {
  accessToken: string;
  expiresIn: number;
}

export function useGoogleAccessToken(onSuccess: (result: GoogleTokenResult) => void) {
  return useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: (tokenResponse) =>
      onSuccess({
        accessToken: tokenResponse.access_token,
        expiresIn: tokenResponse.expires_in,
      }),
    onError: () => console.error('Google login failed'),
  });
}
