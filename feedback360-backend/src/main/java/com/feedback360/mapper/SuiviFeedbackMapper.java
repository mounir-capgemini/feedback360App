package com.feedback360.mapper;

import com.feedback360.dto.SuiviFeedbackDTO;
import com.feedback360.entity.SuiviFeedback;
import org.mapstruct.*;

/**
 * Mapper MapStruct pour SuiviFeedback <-> SuiviFeedbackDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SuiviFeedbackMapper {

    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "trainingSession.name", target = "sessionName")
    @Mapping(source = "trainingSession.id", target = "sessionId")
    SuiviFeedbackDTO toDTO(SuiviFeedback suiviFeedback);

    SuiviFeedback toEntity(SuiviFeedbackDTO dto);
}
