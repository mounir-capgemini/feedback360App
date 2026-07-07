package com.feedback360.mapper;

import com.feedback360.dto.FeedbackDTO;
import com.feedback360.entity.Feedback;
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
public class FeedbackMapperImpl implements FeedbackMapper {

    @Override
    public FeedbackDTO toDTO(Feedback feedback) {
        if ( feedback == null ) {
            return null;
        }

        FeedbackDTO.FeedbackDTOBuilder feedbackDTO = FeedbackDTO.builder();

        feedbackDTO.userName( feedbackUserFullName( feedback ) );
        feedbackDTO.userId( feedbackUserId( feedback ) );
        feedbackDTO.sessionName( feedbackTrainingSessionName( feedback ) );
        feedbackDTO.sessionId( feedbackTrainingSessionId( feedback ) );
        feedbackDTO.comment( feedback.getComment() );
        feedbackDTO.createdAt( feedback.getCreatedAt() );
        feedbackDTO.id( feedback.getId() );
        feedbackDTO.rating( feedback.getRating() );
        feedbackDTO.status( feedback.getStatus() );
        feedbackDTO.updatedAt( feedback.getUpdatedAt() );

        return feedbackDTO.build();
    }

    @Override
    public Feedback toEntity(FeedbackDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Feedback.FeedbackBuilder feedback = Feedback.builder();

        feedback.comment( dto.getComment() );
        feedback.createdAt( dto.getCreatedAt() );
        feedback.id( dto.getId() );
        feedback.rating( dto.getRating() );
        feedback.status( dto.getStatus() );
        feedback.updatedAt( dto.getUpdatedAt() );

        return feedback.build();
    }

    private String feedbackUserFullName(Feedback feedback) {
        if ( feedback == null ) {
            return null;
        }
        User user = feedback.getUser();
        if ( user == null ) {
            return null;
        }
        String fullName = user.getFullName();
        if ( fullName == null ) {
            return null;
        }
        return fullName;
    }

    private Long feedbackUserId(Feedback feedback) {
        if ( feedback == null ) {
            return null;
        }
        User user = feedback.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String feedbackTrainingSessionName(Feedback feedback) {
        if ( feedback == null ) {
            return null;
        }
        TrainingSession trainingSession = feedback.getTrainingSession();
        if ( trainingSession == null ) {
            return null;
        }
        String name = trainingSession.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long feedbackTrainingSessionId(Feedback feedback) {
        if ( feedback == null ) {
            return null;
        }
        TrainingSession trainingSession = feedback.getTrainingSession();
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
