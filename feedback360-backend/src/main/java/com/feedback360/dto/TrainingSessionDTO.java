package com.feedback360.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO pour la représentation d'une session de formation.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingSessionDTO {

    private Long id;
    private Long talentUpModuleId;
    private String name;
    private String typeLabel;
    private Long typeId;
    private String parcoursName;
    private Long parcoursId;
    private String populationName;
    private Long populationId;
    private LocalDateTime createdAt;
    private long feedbackCount;
    private long pendingFeedbackCount;
}
