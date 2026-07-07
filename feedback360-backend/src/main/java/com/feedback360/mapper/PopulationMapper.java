package com.feedback360.mapper;

import com.feedback360.dto.PopulationDTO;
import com.feedback360.entity.Population;
import org.mapstruct.*;

/**
 * Mapper MapStruct pour Population <-> PopulationDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PopulationMapper {

    PopulationDTO toDTO(Population population);

    Population toEntity(PopulationDTO dto);
}
