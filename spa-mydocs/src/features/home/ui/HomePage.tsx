import { FileText, Clock, Star, Plus, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';
import { Navbar } from '../../../shared/ui/layout/Navbar';

const stats = [
  { label: 'Documents', value: '0', icon: FileText, bg: 'bg-indigo-50', color: 'text-indigo-600' },
  { label: 'Recent', value: '0', icon: Clock, bg: 'bg-sky-50', color: 'text-sky-600' },
  { label: 'Starred', value: '0', icon: Star, bg: 'bg-amber-50', color: 'text-amber-600' },
];

const quickActions = [
  { label: 'New Document', description: 'Start writing from a blank page', icon: FileText },
  { label: 'Browse Templates', description: 'Kickstart with a ready-made layout', icon: Layout },
];

function Layout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
         strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

export function HomePage() {
  const user = useAuthStore((s) => s.user)!;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">

        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600 mb-1">{greeting} ✦</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, <span className="text-indigo-600">{user.nickname}</span>
            </h1>
            <p className="mt-1.5 text-slate-500 text-sm sm:text-base">
              Here's an overview of your workspace.
            </p>
          </div>
          <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-indigo-600
                             hover:bg-indigo-700 text-white text-sm font-medium rounded-xl
                             shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            <Plus className="w-4 h-4" />
            New Document
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {stats.map(({ label, value, icon: Icon, bg, color }) => (
            <div key={label}
                 className="bg-white rounded-2xl border border-slate-100 shadow-sm
                            p-4 sm:p-6 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">Quick start</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {quickActions.map(({ label, description, icon: Icon }) => (
              <button key={label}
                      className="group flex items-center gap-4 bg-white border border-slate-100
                                 rounded-2xl p-5 text-left shadow-sm hover:shadow-md
                                 hover:border-indigo-100 transition-all duration-200 cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0
                                group-hover:bg-indigo-600 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600
                                       group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm
                        p-8 sm:p-14 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No documents yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mb-7 leading-relaxed">
            Create your first document and start building your knowledge base.
          </p>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700
                             text-white font-medium text-sm rounded-xl shadow-sm hover:shadow-md
                             transition-all duration-200 cursor-pointer">
            <Plus className="w-4 h-4" />
            Create first document
          </button>
        </div>

      </main>
    </div>
  );
}
