package dev.skypea.mic_mydocs.workspace.domain.port.out;

import dev.skypea.mic_mydocs.workspace.domain.model.Workspace;

import java.util.List;
import java.util.Optional;

public interface WorkspaceRepository {
    List<Workspace> findAllByUserId(String userId);
    Optional<Workspace> findById(String id);
    Workspace save(Workspace workspace);
    void deleteById(String id);
    long countOwnedByUserId(String userId);
    void addMember(String workspaceId, String userId);
    void removeMember(String workspaceId, String userId);
    boolean isMember(String workspaceId, String userId);
}
