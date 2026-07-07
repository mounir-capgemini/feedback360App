package com.feedback360.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * DTO pour la création d'un feedback.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackCreateDTO {

    @NotNull(message = "L'ID de la session est obligatoire")
    private Long sessionId;

    @NotBlank(message = "Le commentaire est obligatoire")
    private String comment;

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    private Integer rating;
}
