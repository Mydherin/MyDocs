package dev.skypea.mic_mydocs.workspace.infrastructure.web;

import dev.skypea.mic_mydocs.auth.domain.model.User;
import dev.skypea.mic_mydocs.workspace.application.*;
import dev.skypea.mic_mydocs.workspace.domain.model.Workspace;
import dev.skypea.mic_mydocs.workspace.domain.port.in.*;
import dev.skypea.mic_mydocs.workspace.infrastructure.web.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final GetWorkspacesUseCase getWorkspacesUseCase;
    private final CreateWorkspaceUseCase createWorkspaceUseCase;
    private final UpdateWorkspaceUseCase updateWorkspaceUseCase;
    private final DeleteWorkspaceUseCase deleteWorkspaceUseCase;
    private final ShareWorkspaceUseCase shareWorkspaceUseCase;
    private final RemoveWorkspaceMemberUseCase removeWorkspaceMemberUseCase;

    @GetMapping
    public List<WorkspaceResponse> getAll(HttpServletRequest request) {
        var user = authenticatedUser(request);
        return getWorkspacesUseCase.getWorkspaces(user.getId()).stream()
                .map(w -> toResponse(w, user.getId()))
                .toList();
    }

    @PostMapping
    public ResponseEntity<WorkspaceResponse> create(@RequestBody CreateWorkspaceRequest body,
                                                     HttpServletRequest request) {
        var user = authenticatedUser(request);
        var workspace = createWorkspaceUseCase.create(user.getId(), body.name());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(workspace, user.getId()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody UpdateWorkspaceRequest body,
                                    HttpServletRequest request) {
        var user = authenticatedUser(request);
        try {
            return ResponseEntity.ok(toResponse(updateWorkspaceUseCase.update(id, user.getId(), body.name()), user.getId()));
        } catch (WorkspaceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (WorkspaceAccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "access_denied"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id, HttpServletRequest request) {
        var user = authenticatedUser(request);
        try {
            deleteWorkspaceUseCase.delete(id, user.getId());
            return ResponseEntity.noContent().build();
        } catch (WorkspaceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (WorkspaceAccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "access_denied"));
        } catch (LastWorkspaceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "last_workspace"));
        }
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> share(@PathVariable String id,
                                   @RequestBody ShareWorkspaceRequest body,
                                   HttpServletRequest request) {
        var user = authenticatedUser(request);
        try {
            return ResponseEntity.ok(toResponse(shareWorkspaceUseCase.share(id, user.getId(), body.email()), user.getId()));
        } catch (WorkspaceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (WorkspaceAccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "access_denied"));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(Map.of("error", "user_not_found"));
        }
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable String id,
                                          @PathVariable String userId,
                                          HttpServletRequest request) {
        var user = authenticatedUser(request);
        try {
            return ResponseEntity.ok(toResponse(removeWorkspaceMemberUseCase.removeMember(id, user.getId(), userId), user.getId()));
        } catch (WorkspaceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (WorkspaceAccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "access_denied"));
        }
    }

    private User authenticatedUser(HttpServletRequest request) {
        return (User) request.getAttribute("authenticatedUser");
    }

    private WorkspaceResponse toResponse(Workspace workspace, String requestingUserId) {
        var role = workspace.getOwnerId().equals(requestingUserId) ? "OWNER" : "MEMBER";
        var members = workspace.getMembers().stream()
                .map(m -> new WorkspaceMemberDto(m.getUserId(), m.getNickname(), m.getEmail(), m.getPicture()))
                .toList();
        return new WorkspaceResponse(workspace.getId(), workspace.getName(), workspace.getOwnerId(),
                workspace.getCreatedAt(), members, role);
    }
}
