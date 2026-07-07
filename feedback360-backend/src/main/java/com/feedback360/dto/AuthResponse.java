package com.feedback360.dto;

import lombok.*;

/**
 * DTO pour la réponse d'authentification contenant le JWT token.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long userId;
    private String email;
    private String fullName;
    private String role;
}
