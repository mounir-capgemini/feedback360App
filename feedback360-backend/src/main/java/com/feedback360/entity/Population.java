package com.feedback360.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité Population — représente une population cible (ex: "Angular").
 */
@Entity
@Table(name = "populations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Population {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID de la population dans le système TalentUp */
    @Column(name = "talent_up_population_id", unique = true)
    private Long talentUpPopulationId;

    @Column(nullable = false)
    private String name;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "population", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TrainingSession> trainingSessions = new ArrayList<>();
}
