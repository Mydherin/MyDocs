package dev.skypea.mic_mydocs.workspace.domain.port.in;

import dev.skypea.mic_mydocs.workspace.domain.model.Workspace;

import java.util.List;

public interface GetWorkspacesUseCase {
    List<Workspace> getWorkspaces(String userId);
}
