package com.feedback360.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entité SuiviFeedback — suivi du statut d'un feedback pour un utilisateur sur une session.
 * Créé automatiquement lors de l'import TalentUp avec le statut EN_ATTENTE.
 */
@Entity
@Table(name = "suivi_feedbacks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuiviFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FeedbackStatus status = FeedbackStatus.EN_ATTENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_session_id", nullable = false)
    private TrainingSession trainingSession;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
