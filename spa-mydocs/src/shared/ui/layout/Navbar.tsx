import { LogOut, FileText } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/store/authStore';
import type { User } from '../../../features/auth/domain/model/User';

function UserAvatar({ user }: { user: User }) {
  if (user.picture) {
    return (
      <img
        src={user.picture}
        alt={user.nickname}
        referrerPolicy="no-referrer"
        className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 shadow-sm flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center
                    text-white text-sm font-semibold shadow-sm flex-shrink-0">
      {user.nickname.charAt(0).toUpperCase()}
    </div>
  );
}

export function Navbar({ user }: { user: User }) {
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">MyDocs</span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* User chip — name + email hidden on mobile */}
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <UserAvatar user={user} />
            <div className="hidden sm:flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-900 leading-none truncate max-w-36">
                {user.nickname}
              </span>
              <span className="text-xs text-slate-400 leading-none mt-0.5 truncate max-w-36">
                {user.email}
              </span>
            </div>
          </div>

          {/* Logout — icon-only on mobile, icon + text on desktop */}
          <button
            onClick={signOut}
            title="Logout"
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl
                       text-slate-400 hover:text-red-600 hover:bg-red-50
                       border border-transparent hover:border-red-100
                       transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
}
