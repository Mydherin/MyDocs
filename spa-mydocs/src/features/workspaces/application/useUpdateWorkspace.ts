import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { updateWorkspace } from '../infrastructure/api/workspaceApiAdapter';

export function useUpdateWorkspace() {
  const updateInStore = useWorkspaceStore((s) => s.updateWorkspace);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const workspace = await updateWorkspace(id, name);
      updateInStore(workspace);
      return workspace;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown_error');
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
}
