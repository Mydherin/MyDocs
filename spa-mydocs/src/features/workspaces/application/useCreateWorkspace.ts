import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { createWorkspace } from '../infrastructure/api/workspaceApiAdapter';
import type { Workspace } from '../domain/model/Workspace';

export function useCreateWorkspace() {
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (name: string): Promise<Workspace | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      const workspace = await createWorkspace(name);
      addWorkspace(workspace);
      return workspace;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown_error');
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
