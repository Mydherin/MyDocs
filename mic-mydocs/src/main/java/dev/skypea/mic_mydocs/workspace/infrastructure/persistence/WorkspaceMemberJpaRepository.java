package dev.skypea.mic_mydocs.workspace.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

interface WorkspaceMemberJpaRepository extends JpaRepository<WorkspaceMemberJpaEntity, WorkspaceMemberKey> {

    List<WorkspaceMemberJpaEntity> findAllByIdWorkspaceId(String workspaceId);

    void deleteByIdWorkspaceIdAndIdUserId(String workspaceId, String userId);

    boolean existsByIdWorkspaceIdAndIdUserId(String workspaceId, String userId);
}
