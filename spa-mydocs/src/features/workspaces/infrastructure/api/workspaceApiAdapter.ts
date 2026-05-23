import type { Workspace } from '../../domain/model/Workspace';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';

export function getWorkspaces(): Promise<Workspace[]> {
  return apiRequest<Workspace[]>('/workspaces');
}

export function createWorkspace(name: string): Promise<Workspace> {
  return apiRequest<Workspace>('/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function updateWorkspace(id: string, name: string): Promise<Workspace> {
  return apiRequest<Workspace>(`/workspaces/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

export function deleteWorkspace(id: string): Promise<void> {
  return apiRequest<void>(`/workspaces/${id}`, { method: 'DELETE' });
}

export function shareWorkspace(id: string, email: string): Promise<Workspace> {
  return apiRequest<Workspace>(`/workspaces/${id}/members`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function removeWorkspaceMember(id: string, userId: string): Promise<Workspace> {
  return apiRequest<Workspace>(`/workspaces/${id}/members/${userId}`, { method: 'DELETE' });
}
