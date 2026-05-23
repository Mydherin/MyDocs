package dev.skypea.mic_mydocs.workspace.domain.port.in;

import dev.skypea.mic_mydocs.workspace.domain.model.Workspace;

public interface CreateWorkspaceUseCase {
    Workspace create(String ownerId, String name);
}
