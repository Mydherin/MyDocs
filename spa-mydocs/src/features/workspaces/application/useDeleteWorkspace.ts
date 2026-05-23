import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { deleteWorkspace } from '../infrastructure/api/workspaceApiAdapter';

export function useDeleteWorkspace() {
  const removeWorkspace = useWorkspaceStore((s) => s.removeWorkspace);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteWorkspace(id);
      removeWorkspace(id);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown_error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { remove, isLoading, error };
}
