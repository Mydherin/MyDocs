package dev.skypea.mic_mydocs.workspace.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "workspaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
class WorkspaceJpaEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "owner_id", nullable = false)
    private String ownerId;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
