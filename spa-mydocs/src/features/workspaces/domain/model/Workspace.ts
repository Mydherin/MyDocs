export interface WorkspaceMember {
  userId: string;
  nickname: string;
  email: string;
  picture: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  members: WorkspaceMember[];
  role: 'OWNER' | 'MEMBER';
}
