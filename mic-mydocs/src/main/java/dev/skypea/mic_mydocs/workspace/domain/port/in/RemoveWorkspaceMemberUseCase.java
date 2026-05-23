package dev.skypea.mic_mydocs.workspace.domain.port.in;

import dev.skypea.mic_mydocs.workspace.domain.model.Workspace;

public interface RemoveWorkspaceMemberUseCase {
    Workspace removeMember(String workspaceId, String requestingUserId, String targetUserId);
}
