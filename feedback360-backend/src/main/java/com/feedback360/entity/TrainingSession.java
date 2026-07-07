package com.feedback360.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité TrainingSession — représente un module de formation (correspond au "module" dans TalentUp).
 * Associé à un Parcours et une Population.
 */
@Entity
@Table(name = "training_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID du module dans le système TalentUp */
    @Column(name = "talent_up_module_id", unique = true)
    private Long talentUpModuleId;

    @Column(nullable = false)
    private String name;

    /** Label du type de module (ex: "Apprentissage_TU") */
    @Column(name = "type_label")
    private String typeLabel;

    /** ID du type dans TalentUp */
    @Column(name = "type_id")
    private Long typeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcours_id")
    private Parcours parcours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "population_id")
    private Population population;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "trainingSession", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Feedback> feedbacks = new ArrayList<>();

    @OneToMany(mappedBy = "trainingSession", cascade = CascadeType.ALL)
    @Builder.Default
    private List<SuiviFeedback> suiviFeedbacks = new ArrayList<>();
}
