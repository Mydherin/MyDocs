package dev.skypea.mic_mydocs.workspace.domain.port.in;

import dev.skypea.mic_mydocs.workspace.domain.model.Workspace;

public interface ShareWorkspaceUseCase {
    Workspace share(String workspaceId, String requestingUserId, String targetUserEmail);
}
