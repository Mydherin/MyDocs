import { useEffect } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { getWorkspaces } from '../infrastructure/api/workspaceApiAdapter';

export function useGetWorkspaces(onError?: (msg: string) => void) {
  const setWorkspaces = useWorkspaceStore((s) => s.setWorkspaces);
  const setLoading = useWorkspaceStore((s) => s.setLoading);

  useEffect(() => {
    setLoading(true);
    getWorkspaces()
      .then(setWorkspaces)
      .catch(() => onError?.('Could not load workspaces. Check your connection.'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
