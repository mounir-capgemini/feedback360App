package com.feedback360.dto;

import com.feedback360.entity.Role;
import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO pour la représentation d'un utilisateur.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private Long talentUpUserId;
    private String email;
    private String fullName;
    private Role role;
    private String photo;
    private LocalDateTime createdAt;
}
