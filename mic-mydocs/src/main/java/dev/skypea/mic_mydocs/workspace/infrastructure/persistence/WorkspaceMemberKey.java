package dev.skypea.mic_mydocs.workspace.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
class WorkspaceMemberKey implements Serializable {

    @Column(name = "workspace_id")
    private String workspaceId;

    @Column(name = "user_id")
    private String userId;
}
