package dev.skypea.mic_mydocs.workspace.infrastructure.persistence;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "workspace_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
class WorkspaceMemberJpaEntity {

    @EmbeddedId
    private WorkspaceMemberKey id;
}
