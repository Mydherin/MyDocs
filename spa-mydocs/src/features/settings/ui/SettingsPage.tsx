import { useState } from 'react';
import { ArrowLeft, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { useGetWorkspaces } from '../../workspaces/application/useGetWorkspaces';
import { Navbar } from '../../../shared/ui/layout/Navbar';
import { WorkspacesSection } from './WorkspacesSection';

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)!;
  const navigate = useNavigate();
  const [fetchError, setFetchError] = useState<string | null>(null);

  useGetWorkspaces((msg) => setFetchError(msg));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">

        {/* Page header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600
                       transition-colors cursor-pointer mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="mt-1.5 text-slate-500 text-sm sm:text-base">
            Manage your account and workspaces.
          </p>
        </div>

        {/* Workspaces card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden max-w-2xl">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Workspaces</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch, create, share, or delete your workspaces.
              </p>
            </div>
          </div>
          <div className="px-6 py-6">
            <WorkspacesSection initialFetchError={fetchError} onClearError={() => setFetchError(null)} />
          </div>
        </div>

      </main>
    </div>
  );
}
