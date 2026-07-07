package com.feedback360.mapper;

import com.feedback360.dto.PopulationDTO;
import com.feedback360.entity.Population;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-07T01:52:01+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class PopulationMapperImpl implements PopulationMapper {

    @Override
    public PopulationDTO toDTO(Population population) {
        if ( population == null ) {
            return null;
        }

        PopulationDTO.PopulationDTOBuilder populationDTO = PopulationDTO.builder();

        populationDTO.createdAt( population.getCreatedAt() );
        populationDTO.id( population.getId() );
        populationDTO.name( population.getName() );
        populationDTO.talentUpPopulationId( population.getTalentUpPopulationId() );

        return populationDTO.build();
    }

    @Override
    public Population toEntity(PopulationDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Population.PopulationBuilder population = Population.builder();

        population.createdAt( dto.getCreatedAt() );
        population.id( dto.getId() );
        population.name( dto.getName() );
        population.talentUpPopulationId( dto.getTalentUpPopulationId() );

        return population.build();
    }
}
