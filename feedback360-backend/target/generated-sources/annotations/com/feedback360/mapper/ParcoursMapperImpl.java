package com.feedback360.mapper;

import com.feedback360.dto.ParcoursDTO;
import com.feedback360.entity.Parcours;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-07T01:52:01+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class ParcoursMapperImpl implements ParcoursMapper {

    @Override
    public ParcoursDTO toDTO(Parcours parcours) {
        if ( parcours == null ) {
            return null;
        }

        ParcoursDTO.ParcoursDTOBuilder parcoursDTO = ParcoursDTO.builder();

        parcoursDTO.createdAt( parcours.getCreatedAt() );
        parcoursDTO.id( parcours.getId() );
        parcoursDTO.name( parcours.getName() );
        parcoursDTO.talentUpParcoursId( parcours.getTalentUpParcoursId() );

        return parcoursDTO.build();
    }

    @Override
    public Parcours toEntity(ParcoursDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Parcours.ParcoursBuilder parcours = Parcours.builder();

        parcours.createdAt( dto.getCreatedAt() );
        parcours.id( dto.getId() );
        parcours.name( dto.getName() );
        parcours.talentUpParcoursId( dto.getTalentUpParcoursId() );

        return parcours.build();
    }
}
