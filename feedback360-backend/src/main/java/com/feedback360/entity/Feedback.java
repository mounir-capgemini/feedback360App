package com.feedback360.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entité Feedback — représente un feedback donné par un participant sur une session de formation.
 */
@Entity
@Table(name = "feedbacks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Commentaire du feedback */
    @Column(columnDefinition = "TEXT")
    private String comment;

    /** Note de 1 à 5 */
    @Column(nullable = false)
    private Integer rating;

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
