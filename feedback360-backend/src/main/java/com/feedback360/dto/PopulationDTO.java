package com.feedback360.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO pour la représentation d'une population.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PopulationDTO {

    private Long id;
    private Long talentUpPopulationId;
    private String name;
    private LocalDateTime createdAt;
}
