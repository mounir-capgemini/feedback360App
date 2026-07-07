package com.feedback360.mapper;

import com.feedback360.dto.FeedbackDTO;
import com.feedback360.entity.Feedback;
import org.mapstruct.*;

/**
 * Mapper MapStruct pour Feedback <-> FeedbackDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FeedbackMapper {

    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "trainingSession.name", target = "sessionName")
    @Mapping(source = "trainingSession.id", target = "sessionId")
    FeedbackDTO toDTO(Feedback feedback);

    Feedback toEntity(FeedbackDTO dto);
}
