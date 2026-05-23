package dev.skypea.mic_mydocs.workspace.domain.port.in;

public interface DeleteWorkspaceUseCase {
    void delete(String workspaceId, String requestingUserId);
}
