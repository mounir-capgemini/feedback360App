package com.feedback360.mapper;

import com.feedback360.dto.SuiviFeedbackDTO;
import com.feedback360.entity.SuiviFeedback;
import com.feedback360.entity.TrainingSession;
import com.feedback360.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-07T01:52:01+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class SuiviFeedbackMapperImpl implements SuiviFeedbackMapper {

    @Override
    public SuiviFeedbackDTO toDTO(SuiviFeedback suiviFeedback) {
        if ( suiviFeedback == null ) {
            return null;
        }

        SuiviFeedbackDTO.SuiviFeedbackDTOBuilder suiviFeedbackDTO = SuiviFeedbackDTO.builder();

        suiviFeedbackDTO.userName( suiviFeedbackUserFullName( suiviFeedback ) );
        suiviFeedbackDTO.userId( suiviFeedbackUserId( suiviFeedback ) );
        suiviFeedbackDTO.sessionName( suiviFeedbackTrainingSessionName( suiviFeedback ) );
        suiviFeedbackDTO.sessionId( suiviFeedbackTrainingSessionId( suiviFeedback ) );
        suiviFeedbackDTO.createdAt( suiviFeedback.getCreatedAt() );
        suiviFeedbackDTO.id( suiviFeedback.getId() );
        suiviFeedbackDTO.status( suiviFeedback.getStatus() );
        suiviFeedbackDTO.updatedAt( suiviFeedback.getUpdatedAt() );

        return suiviFeedbackDTO.build();
    }

    @Override
    public SuiviFeedback toEntity(SuiviFeedbackDTO dto) {
        if ( dto == null ) {
            return null;
        }

        SuiviFeedback.SuiviFeedbackBuilder suiviFeedback = SuiviFeedback.builder();

        suiviFeedback.createdAt( dto.getCreatedAt() );
        suiviFeedback.id( dto.getId() );
        suiviFeedback.status( dto.getStatus() );
        suiviFeedback.updatedAt( dto.getUpdatedAt() );

        return suiviFeedback.build();
    }

    private String suiviFeedbackUserFullName(SuiviFeedback suiviFeedback) {
        if ( suiviFeedback == null ) {
            return null;
        }
        User user = suiviFeedback.getUser();
        if ( user == null ) {
            return null;
        }
        String fullName = user.getFullName();
        if ( fullName == null ) {
            return null;
        }
        return fullName;
    }

    private Long suiviFeedbackUserId(SuiviFeedback suiviFeedback) {
        if ( suiviFeedback == null ) {
            return null;
        }
        User user = suiviFeedback.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String suiviFeedbackTrainingSessionName(SuiviFeedback suiviFeedback) {
        if ( suiviFeedback == null ) {
            return null;
        }
        TrainingSession trainingSession = suiviFeedback.getTrainingSession();
        if ( trainingSession == null ) {
            return null;
        }
        String name = trainingSession.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long suiviFeedbackTrainingSessionId(SuiviFeedback suiviFeedback) {
        if ( suiviFeedback == null ) {
            return null;
        }
        TrainingSession trainingSession = suiviFeedback.getTrainingSession();
        if ( trainingSession == null ) {
            return null;
        }
        Long id = trainingSession.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
