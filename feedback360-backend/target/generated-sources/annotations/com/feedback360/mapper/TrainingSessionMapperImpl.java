package com.feedback360.mapper;

import com.feedback360.dto.TrainingSessionDTO;
import com.feedback360.entity.Parcours;
import com.feedback360.entity.Population;
import com.feedback360.entity.TrainingSession;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-07T01:52:01+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class TrainingSessionMapperImpl implements TrainingSessionMapper {

    @Override
    public TrainingSessionDTO toDTO(TrainingSession session) {
        if ( session == null ) {
            return null;
        }

        TrainingSessionDTO.TrainingSessionDTOBuilder trainingSessionDTO = TrainingSessionDTO.builder();

        trainingSessionDTO.parcoursName( sessionParcoursName( session ) );
        trainingSessionDTO.parcoursId( sessionParcoursId( session ) );
        trainingSessionDTO.populationName( sessionPopulationName( session ) );
        trainingSessionDTO.populationId( sessionPopulationId( session ) );
        trainingSessionDTO.createdAt( session.getCreatedAt() );
        trainingSessionDTO.id( session.getId() );
        trainingSessionDTO.name( session.getName() );
        trainingSessionDTO.talentUpModuleId( session.getTalentUpModuleId() );
        trainingSessionDTO.typeId( session.getTypeId() );
        trainingSessionDTO.typeLabel( session.getTypeLabel() );

        return trainingSessionDTO.build();
    }

    @Override
    public TrainingSession toEntity(TrainingSessionDTO dto) {
        if ( dto == null ) {
            return null;
        }

        TrainingSession.TrainingSessionBuilder trainingSession = TrainingSession.builder();

        trainingSession.createdAt( dto.getCreatedAt() );
        trainingSession.id( dto.getId() );
        trainingSession.name( dto.getName() );
        trainingSession.talentUpModuleId( dto.getTalentUpModuleId() );
        trainingSession.typeId( dto.getTypeId() );
        trainingSession.typeLabel( dto.getTypeLabel() );

        return trainingSession.build();
    }

    private String sessionParcoursName(TrainingSession trainingSession) {
        if ( trainingSession == null ) {
            return null;
        }
        Parcours parcours = trainingSession.getParcours();
        if ( parcours == null ) {
            return null;
        }
        String name = parcours.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long sessionParcoursId(TrainingSession trainingSession) {
        if ( trainingSession == null ) {
            return null;
        }
        Parcours parcours = trainingSession.getParcours();
        if ( parcours == null ) {
            return null;
        }
        Long id = parcours.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String sessionPopulationName(TrainingSession trainingSession) {
        if ( trainingSession == null ) {
            return null;
        }
        Population population = trainingSession.getPopulation();
        if ( population == null ) {
            return null;
        }
        String name = population.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long sessionPopulationId(TrainingSession trainingSession) {
        if ( trainingSession == null ) {
            return null;
        }
        Population population = trainingSession.getPopulation();
        if ( population == null ) {
            return null;
        }
        Long id = population.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
