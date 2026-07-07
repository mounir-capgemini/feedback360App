package com.feedback360.mapper;

import com.feedback360.dto.ParcoursDTO;
import com.feedback360.entity.Parcours;
import org.mapstruct.*;

/**
 * Mapper MapStruct pour Parcours <-> ParcoursDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ParcoursMapper {

    ParcoursDTO toDTO(Parcours parcours);

    Parcours toEntity(ParcoursDTO dto);
}
