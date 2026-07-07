package com.feedback360.mapper;

import com.feedback360.dto.TrainingSessionDTO;
import com.feedback360.entity.TrainingSession;
import org.mapstruct.*;

/**
 * Mapper MapStruct pour TrainingSession <-> TrainingSessionDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TrainingSessionMapper {

    @Mapping(source = "parcours.name", target = "parcoursName")
    @Mapping(source = "parcours.id", target = "parcoursId")
    @Mapping(source = "population.name", target = "populationName")
    @Mapping(source = "population.id", target = "populationId")
    TrainingSessionDTO toDTO(TrainingSession session);

    TrainingSession toEntity(TrainingSessionDTO dto);
}
