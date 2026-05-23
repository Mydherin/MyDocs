package dev.skypea.mic_mydocs.workspace.domain.model;

import lombok.Builder;
import lombok.Value;

import java.time.OffsetDateTime;
import java.util.List;

@Value
@Builder
public class Workspace {
    String id;
    String name;
    String ownerId;
    OffsetDateTime createdAt;
    List<WorkspaceMember> members;
}
