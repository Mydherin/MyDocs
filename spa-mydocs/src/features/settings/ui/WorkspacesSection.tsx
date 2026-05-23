import { useState } from 'react';
import {
  Check, Trash2, Plus, Loader2, AlertCircle,
  Pencil, X, UserPlus, UserMinus, RefreshCw,
} from 'lucide-react';
import { useWorkspaceStore } from '../../workspaces/store/workspaceStore';
import { useCreateWorkspace } from '../../workspaces/application/useCreateWorkspace';
import { useDeleteWorkspace } from '../../workspaces/application/useDeleteWorkspace';
import { useUpdateWorkspace } from '../../workspaces/application/useUpdateWorkspace';
import { useShareWorkspace } from '../../workspaces/application/useShareWorkspace';
import { getWorkspaces } from '../../workspaces/infrastructure/api/workspaceApiAdapter';

interface Props {
  initialFetchError?: string | null;
  onClearError?: () => void;
}

export function WorkspacesSection({ initialFetchError, onClearError }: Props) {
  const { workspaces, activeWorkspaceId, isLoading, setActiveWorkspace, setWorkspaces, setLoading } =
    useWorkspaceStore();

  const { create, isLoading: creating } = useCreateWorkspace();
  const { remove, isLoading: deleting, error: deleteError } = useDeleteWorkspace();
  const { update, isLoading: updating } = useUpdateWorkspace();
  const { share, removeAccess, isLoading: sharing, error: shareError } = useShareWorkspace();

  const [retryError, setRetryError] = useState<string | null>(null);
  const fetchError = retryError ?? initialFetchError ?? null;
  const [newName, setNewName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');

  const ownedCount = workspaces.filter((w) => w.role === 'OWNER').length;

  const retry = () => {
    setRetryError(null);
    onClearError?.();
    setLoading(true);
    getWorkspaces()
      .then(setWorkspaces)
      .catch(() => setRetryError('Could not load workspaces. Check your connection.'))
      .finally(() => setLoading(false));
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    const created = await create(name);
    if (created) setNewName('');
  };

  const handleDelete = async (id: string) => {
    const ok = await remove(id);
    if (ok) setConfirmDeleteId(null);
  };

  const handleUpdate = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const result = await update(id, name);
    if (result) setEditingId(null);
  };

  const handleShare = async (workspaceId: string) => {
    const email = shareEmail.trim();
    if (!email) return;
    const result = await share(workspaceId, email);
    if (result) { setShareEmail(''); setSharingId(null); }
  };

  return (
    <div className="space-y-3">

      {/* Error state */}
      {fetchError && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-700">{fetchError}</p>
          </div>
          <button
            onClick={retry}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600
                       hover:bg-red-100 rounded-xl transition-colors cursor-pointer flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-100 rounded-full w-36" />
                  <div className="h-3 bg-slate-100 rounded-full w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workspace list */}
      {!isLoading && workspaces.length > 0 && (
        <div className="space-y-2.5">
          {workspaces.map((workspace) => {
            const isActive = workspace.id === activeWorkspaceId;
            const isOwner = workspace.role === 'OWNER';
            const canDelete = isOwner && ownedCount > 1;
            const isConfirmingDelete = confirmDeleteId === workspace.id;
            const isEditing = editingId === workspace.id;
            const isSharingOpen = sharingId === workspace.id;

            return (
              <div
                key={workspace.id}
                className={`rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-200 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                }`}
              >
                {/* Row */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <button
                    onClick={() => !isActive && setActiveWorkspace(workspace.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-indigo-600 cursor-default'
                        : 'bg-indigo-100 hover:bg-indigo-200 cursor-pointer'
                    }`}
                    title={isActive ? 'Active workspace' : 'Switch to this workspace'}
                  >
                    {isActive
                      ? <Check className="w-4 h-4 text-white" />
                      : <span className="text-sm font-bold text-indigo-600">{workspace.name.charAt(0).toUpperCase()}</span>
                    }
                  </button>

                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <input
                        autoFocus
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdate(workspace.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 min-w-0 px-2.5 py-1.5 text-sm rounded-xl border border-indigo-300
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                      <button
                        onClick={() => handleUpdate(workspace.id)}
                        disabled={updating}
                        className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => !isActive && setActiveWorkspace(workspace.id)}
                      className={`flex-1 min-w-0 text-left ${!isActive ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>
                          {workspace.name}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full flex-shrink-0">
                            Active
                          </span>
                        )}
                        {workspace.role === 'MEMBER' && (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
                            Shared
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isOwner
                          ? `${workspace.members.length} member${workspace.members.length !== 1 ? 's' : ''}`
                          : 'Shared with you'
                        }
                      </p>
                    </button>
                  )}

                  {/* Action icons — only when not editing */}
                  {!isEditing && isOwner && (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => { setEditingId(workspace.id); setEditName(workspace.name); setSharingId(null); setConfirmDeleteId(null); }}
                        title="Rename"
                        className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setSharingId(isSharingOpen ? null : workspace.id); setShareEmail(''); setConfirmDeleteId(null); setEditingId(null); }}
                        title="Share"
                        className="p-1.5 rounded-lg text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => canDelete && setConfirmDeleteId(isConfirmingDelete ? null : workspace.id)}
                        disabled={!canDelete}
                        title={canDelete ? 'Delete workspace' : 'Cannot delete your only workspace'}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50
                                   disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Members list */}
                {isOwner && workspace.members.length > 0 && !isEditing && (
                  <div className="px-4 pb-3 pt-0 space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">Members</p>
                    {workspace.members.map((m) => (
                      <div key={m.userId} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-indigo-600">{m.nickname.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">{m.nickname}</p>
                          <p className="text-[11px] text-slate-400 truncate">{m.email}</p>
                        </div>
                        <button
                          onClick={() => removeAccess(workspace.id, m.userId)}
                          title="Remove access"
                          className="p-1 rounded-lg text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Share form */}
                {isSharingOpen && (
                  <div className="px-4 pb-4">
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleShare(workspace.id);
                          if (e.key === 'Escape') setSharingId(null);
                        }}
                        placeholder="colleague@example.com"
                        className="flex-1 min-w-0 px-3 py-2 text-sm rounded-xl border border-slate-200
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 bg-white"
                      />
                      <button
                        onClick={() => handleShare(workspace.id)}
                        disabled={sharing || !shareEmail.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                                   text-white text-sm font-medium rounded-xl transition-colors cursor-pointer flex-shrink-0"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => setSharingId(null)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {shareError && (
                      <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {shareError === 'user_not_found' ? 'No account found with that email.' : shareError}
                      </p>
                    )}
                  </div>
                )}

                {/* Delete confirmation */}
                {isConfirmingDelete && (
                  <div className="px-4 pb-4">
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3.5">
                      <p className="text-sm text-red-700 mb-3 leading-relaxed">
                        Delete <strong>{workspace.name}</strong>? All shared members will permanently lose access.
                      </p>
                      {deleteError && (
                        <p className="text-xs text-red-500 mb-3 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {deleteError === 'last_workspace' ? 'You must keep at least one workspace.' : deleteError}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(workspace.id)}
                          disabled={deleting}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700
                                     disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                        >
                          {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 text-sm rounded-xl transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state — only when loaded and API returned nothing */}
      {!isLoading && !fetchError && workspaces.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">No workspaces found.</p>
      )}

      {/* Create workspace — always visible */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Create workspace
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
            placeholder="Workspace name…"
            className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-xl border border-slate-200
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       placeholder:text-slate-400 bg-white"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700
                       disabled:opacity-50 text-white text-sm font-medium rounded-xl
                       transition-colors cursor-pointer flex-shrink-0"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create
          </button>
        </div>
      </div>

    </div>
  );
}
