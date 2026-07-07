package com.feedback360.dto;

import com.feedback360.entity.NotificationStatus;
import com.feedback360.entity.NotificationType;
import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO pour la représentation d'une notification.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private Long id;
    private String message;
    private NotificationType type;
    private NotificationStatus status;
    private LocalDateTime createdAt;
}
