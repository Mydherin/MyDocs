package dev.skypea.mic_mydocs.workspace.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

interface WorkspaceJpaRepository extends JpaRepository<WorkspaceJpaEntity, String> {

    List<WorkspaceJpaEntity> findAllByOwnerId(String ownerId);

    long countByOwnerId(String ownerId);

    @Query(value = "SELECT w.* FROM workspaces w JOIN workspace_members m ON m.workspace_id = w.id WHERE m.user_id = :userId",
            nativeQuery = true)
    List<WorkspaceJpaEntity> findSharedWorkspacesByUserId(String userId);
}
