package com.feedback360.mapper;

import com.feedback360.dto.NotificationDTO;
import com.feedback360.entity.Notification;
import org.mapstruct.*;

/**
 * Mapper MapStruct pour Notification <-> NotificationDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {

    NotificationDTO toDTO(Notification notification);

    Notification toEntity(NotificationDTO dto);
}
