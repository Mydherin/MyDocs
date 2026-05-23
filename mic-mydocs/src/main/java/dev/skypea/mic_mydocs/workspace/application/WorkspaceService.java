package dev.skypea.mic_mydocs.workspace.application;

import dev.skypea.mic_mydocs.auth.domain.port.out.UserRepository;
import dev.skypea.mic_mydocs.workspace.domain.model.Workspace;
import dev.skypea.mic_mydocs.workspace.domain.port.in.*;
import dev.skypea.mic_mydocs.workspace.domain.port.out.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceService implements GetWorkspacesUseCase, CreateWorkspaceUseCase, UpdateWorkspaceUseCase,
        DeleteWorkspaceUseCase, ShareWorkspaceUseCase, RemoveWorkspaceMemberUseCase {

    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    @Override
    public List<Workspace> getWorkspaces(String userId) {
        return workspaceRepository.findAllByUserId(userId);
    }

    @Override
    public Workspace create(String ownerId, String name) {
        var workspace = Workspace.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .ownerId(ownerId)
                .members(List.of())
                .build();
        return workspaceRepository.save(workspace);
    }

    @Override
    public Workspace update(String workspaceId, String requestingUserId, String name) {
        var workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFoundException(workspaceId));
        if (!workspace.getOwnerId().equals(requestingUserId)) throw new WorkspaceAccessDeniedException();
        var updated = Workspace.builder()
                .id(workspace.getId())
                .name(name)
                .ownerId(workspace.getOwnerId())
                .createdAt(workspace.getCreatedAt())
                .members(workspace.getMembers())
                .build();
        return workspaceRepository.save(updated);
    }

    @Override
    public void delete(String workspaceId, String requestingUserId) {
        var workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFoundException(workspaceId));
        if (!workspace.getOwnerId().equals(requestingUserId)) throw new WorkspaceAccessDeniedException();
        if (workspaceRepository.countOwnedByUserId(requestingUserId) <= 1) throw new LastWorkspaceException();
        workspaceRepository.deleteById(workspaceId);
    }

    @Override
    public Workspace share(String workspaceId, String requestingUserId, String targetUserEmail) {
        var workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFoundException(workspaceId));
        if (!workspace.getOwnerId().equals(requestingUserId)) throw new WorkspaceAccessDeniedException();
        var target = userRepository.findByEmail(targetUserEmail)
                .orElseThrow(() -> new UserNotFoundException(targetUserEmail));
        if (!workspaceRepository.isMember(workspaceId, target.getId())) {
            workspaceRepository.addMember(workspaceId, target.getId());
        }
        return workspaceRepository.findById(workspaceId).orElseThrow();
    }

    @Override
    public Workspace removeMember(String workspaceId, String requestingUserId, String targetUserId) {
        var workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFoundException(workspaceId));
        if (!workspace.getOwnerId().equals(requestingUserId)) throw new WorkspaceAccessDeniedException();
        workspaceRepository.removeMember(workspaceId, targetUserId);
        return workspaceRepository.findById(workspaceId).orElseThrow();
    }
}
