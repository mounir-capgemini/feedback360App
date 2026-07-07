package com.feedback360.dto;

import com.feedback360.entity.FeedbackStatus;
import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO pour la représentation d'un feedback.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackDTO {

    private Long id;
    private String comment;
    private Integer rating;
    private FeedbackStatus status;
    private String userName;
    private Long userId;
    private String sessionName;
    private Long sessionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
