import { useState, useRef, useEffect } from 'react';
import { LogOut, FileText, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/authStore';
import type { User } from '../../../features/auth/domain/model/User';

function UserMenu({ user }: { user: User }) {
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100
                   hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.nickname}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 shadow-sm flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center
                          text-white text-sm font-semibold shadow-sm flex-shrink-0">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden sm:flex flex-col min-w-0 text-left">
          <span className="text-sm font-semibold text-slate-900 leading-none truncate max-w-36">
            {user.nickname}
          </span>
          <span className="text-xs text-slate-400 leading-none mt-0.5 truncate max-w-36">
            {user.email}
          </span>
        </div>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-52 bg-white rounded-2xl border border-slate-100
                        shadow-lg shadow-slate-200/60 py-1.5 z-50">
          <div className="sm:hidden px-4 py-2.5 border-b border-slate-100 mb-1">
            <p className="text-sm font-semibold text-slate-800 truncate">{user.nickname}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>

          <button
            onClick={() => { navigate('/settings'); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50
                       text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium">Settings</span>
          </button>

          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50
                         text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  user: User;
}

export function Navbar({ user }: Props) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">MyDocs</span>
        </div>

        <UserMenu user={user} />

      </div>
    </header>
  );
}
