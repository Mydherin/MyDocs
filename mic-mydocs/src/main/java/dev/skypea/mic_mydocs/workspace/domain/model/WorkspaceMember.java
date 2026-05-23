package dev.skypea.mic_mydocs.workspace.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class WorkspaceMember {
    String userId;
    String nickname;
    String email;
    String picture;
}
