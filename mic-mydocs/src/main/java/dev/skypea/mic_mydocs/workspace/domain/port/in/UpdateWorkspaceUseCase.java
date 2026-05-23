package dev.skypea.mic_mydocs.workspace.domain.port.in;

import dev.skypea.mic_mydocs.workspace.domain.model.Workspace;

public interface UpdateWorkspaceUseCase {
    Workspace update(String workspaceId, String requestingUserId, String name);
}
