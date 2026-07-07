package com.feedback360.mapper;

import com.feedback360.dto.NotificationDTO;
import com.feedback360.entity.Notification;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-07T01:52:01+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class NotificationMapperImpl implements NotificationMapper {

    @Override
    public NotificationDTO toDTO(Notification notification) {
        if ( notification == null ) {
            return null;
        }

        NotificationDTO.NotificationDTOBuilder notificationDTO = NotificationDTO.builder();

        notificationDTO.createdAt( notification.getCreatedAt() );
        notificationDTO.id( notification.getId() );
        notificationDTO.message( notification.getMessage() );
        notificationDTO.status( notification.getStatus() );
        notificationDTO.type( notification.getType() );

        return notificationDTO.build();
    }

    @Override
    public Notification toEntity(NotificationDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Notification.NotificationBuilder notification = Notification.builder();

        notification.createdAt( dto.getCreatedAt() );
        notification.id( dto.getId() );
        notification.message( dto.getMessage() );
        notification.status( dto.getStatus() );
        notification.type( dto.getType() );

        return notification.build();
    }
}
