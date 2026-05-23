import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { shareWorkspace, removeWorkspaceMember } from '../infrastructure/api/workspaceApiAdapter';

export function useShareWorkspace() {
  const updateInStore = useWorkspaceStore((s) => s.updateWorkspace);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const share = async (workspaceId: string, email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const workspace = await shareWorkspace(workspaceId, email);
      updateInStore(workspace);
      return workspace;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown_error');
    } finally {
      setIsLoading(false);
    }
  };

  const removeAccess = async (workspaceId: string, userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const workspace = await removeWorkspaceMember(workspaceId, userId);
      updateInStore(workspace);
      return workspace;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown_error');
    } finally {
      setIsLoading(false);
    }
  };

  return { share, removeAccess, isLoading, error };
}
