package dev.skypea.mic_mydocs.workspace.infrastructure.persistence;

import dev.skypea.mic_mydocs.auth.domain.port.out.UserRepository;
import dev.skypea.mic_mydocs.workspace.domain.model.Workspace;
import dev.skypea.mic_mydocs.workspace.domain.model.WorkspaceMember;
import dev.skypea.mic_mydocs.workspace.domain.port.out.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
public class WorkspacePersistenceAdapter implements WorkspaceRepository {

    private final WorkspaceJpaRepository workspaceJpaRepository;
    private final WorkspaceMemberJpaRepository memberJpaRepository;
    private final UserRepository userRepository;

    @Override
    public List<Workspace> findAllByUserId(String userId) {
        var owned = workspaceJpaRepository.findAllByOwnerId(userId);
        var shared = workspaceJpaRepository.findSharedWorkspacesByUserId(userId);
        return Stream.concat(owned.stream(), shared.stream())
                .distinct()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Workspace> findById(String id) {
        return workspaceJpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Workspace save(Workspace workspace) {
        var entity = WorkspaceJpaEntity.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .ownerId(workspace.getOwnerId())
                .createdAt(workspace.getCreatedAt())
                .build();
        return toDomain(workspaceJpaRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        memberJpaRepository.deleteAll(memberJpaRepository.findAllByIdWorkspaceId(id));
        workspaceJpaRepository.deleteById(id);
    }

    @Override
    public long countOwnedByUserId(String userId) {
        return workspaceJpaRepository.countByOwnerId(userId);
    }

    @Override
    public void addMember(String workspaceId, String userId) {
        memberJpaRepository.save(new WorkspaceMemberJpaEntity(new WorkspaceMemberKey(workspaceId, userId)));
    }

    @Override
    @Transactional
    public void removeMember(String workspaceId, String userId) {
        memberJpaRepository.deleteByIdWorkspaceIdAndIdUserId(workspaceId, userId);
    }

    @Override
    public boolean isMember(String workspaceId, String userId) {
        return memberJpaRepository.existsByIdWorkspaceIdAndIdUserId(workspaceId, userId);
    }

    private Workspace toDomain(WorkspaceJpaEntity entity) {
        var memberIds = memberJpaRepository.findAllByIdWorkspaceId(entity.getId())
                .stream()
                .map(m -> m.getId().getUserId())
                .toList();
        var members = userRepository.findAllByIds(memberIds).stream()
                .map(u -> WorkspaceMember.builder()
                        .userId(u.getId())
                        .nickname(u.getNickname())
                        .email(u.getEmail())
                        .picture(u.getPicture())
                        .build())
                .toList();
        return Workspace.builder()
                .id(entity.getId())
                .name(entity.getName())
                .ownerId(entity.getOwnerId())
                .createdAt(entity.getCreatedAt())
                .members(members)
                .build();
    }
}
