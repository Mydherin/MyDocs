import { create } from 'zustand';
import type { Workspace } from '../domain/model/Workspace';

const STORAGE_KEY = 'active_workspace_id';

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  isLoading: boolean;
  setLoading: (v: boolean) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (id: string) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (workspace: Workspace) => void;
  removeWorkspace: (id: string) => void;
  clear: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: localStorage.getItem(STORAGE_KEY),
  isLoading: true,
  setLoading: (isLoading) => set({ isLoading }),

  setWorkspaces: (workspaces) => {
    const current = get().activeWorkspaceId;
    const valid = workspaces.find((w) => w.id === current);
    const activeWorkspaceId = valid ? current : (workspaces[0]?.id ?? null);
    if (activeWorkspaceId) localStorage.setItem(STORAGE_KEY, activeWorkspaceId);
    set({ workspaces, activeWorkspaceId });
  },

  setActiveWorkspace: (id) => {
    localStorage.setItem(STORAGE_KEY, id);
    set({ activeWorkspaceId: id });
  },

  addWorkspace: (workspace) => set((s) => ({ workspaces: [...s.workspaces, workspace] })),

  updateWorkspace: (workspace) =>
    set((s) => ({ workspaces: s.workspaces.map((w) => (w.id === workspace.id ? workspace : w)) })),

  removeWorkspace: (id) =>
    set((s) => {
      const workspaces = s.workspaces.filter((w) => w.id !== id);
      const activeWorkspaceId =
        s.activeWorkspaceId === id ? (workspaces[0]?.id ?? null) : s.activeWorkspaceId;
      if (activeWorkspaceId) localStorage.setItem(STORAGE_KEY, activeWorkspaceId);
      else localStorage.removeItem(STORAGE_KEY);
      return { workspaces, activeWorkspaceId };
    }),

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ workspaces: [], activeWorkspaceId: null });
  },
}));
