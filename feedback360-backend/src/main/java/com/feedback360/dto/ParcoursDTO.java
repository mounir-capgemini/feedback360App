package com.feedback360.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO pour la représentation d'un parcours.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParcoursDTO {

    private Long id;
    private Long talentUpParcoursId;
    private String name;
    private LocalDateTime createdAt;
}
