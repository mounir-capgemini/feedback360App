package com.feedback360.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité Parcours — représente un parcours de formation (ex: "Talent Up").
 */
@Entity
@Table(name = "parcours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parcours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID du parcours dans le système TalentUp */
    @Column(name = "talent_up_parcours_id", unique = true)
    private Long talentUpParcoursId;

    @Column(nullable = false)
    private String name;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "parcours", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TrainingSession> trainingSessions = new ArrayList<>();
}
