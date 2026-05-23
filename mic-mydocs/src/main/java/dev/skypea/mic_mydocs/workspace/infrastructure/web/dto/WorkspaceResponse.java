package dev.skypea.mic_mydocs.workspace.infrastructure.web.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record WorkspaceResponse(
        String id,
        String name,
        String ownerId,
        OffsetDateTime createdAt,
        List<WorkspaceMemberDto> members,
        String role
) {}
