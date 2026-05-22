import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Zap, Layout } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { GoogleSignInButton } from './GoogleSignInButton';

const features = [
  { icon: Shield, label: 'Secure by default' },
  { icon: Zap, label: 'Blazing fast' },
  { icon: Layout, label: 'Clean workspace' },
];

export function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const error = useAuthStore((s) => s.error);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Brand panel (desktop left) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800
                      flex-col items-center justify-center p-16 relative overflow-hidden select-none">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-[30rem] h-[30rem] bg-violet-900/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col gap-10 max-w-sm w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">MyDocs</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
              Your docs,<br />your rules.
            </h1>
            <p className="text-indigo-200 text-lg leading-relaxed">
              A clean, fast workspace to write, organise and share everything that matters.
            </p>
          </div>

          {/* Feature chips */}
          <div className="flex flex-col gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Login panel (right / mobile full) ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MyDocs</span>
          </div>

          {/* Heading */}
          <div className="mb-8 space-y-1.5">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-base">Sign in to continue to your workspace.</p>
          </div>

          {/* Google button */}
          <GoogleSignInButton />

          {/* Error */}
          {error && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Divider */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">SECURE SIGN-IN</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
            By continuing you agree to our{' '}
            <span className="text-slate-600 font-medium underline underline-offset-2 cursor-pointer">Terms</span>
            {' '}and{' '}
            <span className="text-slate-600 font-medium underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
