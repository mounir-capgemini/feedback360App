package com.feedback360.service;

import com.feedback360.dto.AuthResponse;
import com.feedback360.dto.LoginRequest;
import com.feedback360.dto.RegisterRequest;
import com.feedback360.entity.Role;
import com.feedback360.entity.User;
import com.feedback360.exception.BadRequestException;
import com.feedback360.repository.UserRepository;
import com.feedback360.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * Service d'authentification.
 * Gère l'inscription, la connexion et la génération de tokens JWT.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    /**
     * Inscription d'un nouvel utilisateur.
     */
    public AuthResponse register(@NonNull RegisterRequest request) {
        String email = requireNonNullString(request.getEmail(), "Email must not be null");
        String password = requireNonNullString(request.getPassword(), "Password must not be null");

        // Vérifier si l'email est déjà utilisé
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Cet email est déjà utilisé");
        }

        // Créer le nouvel utilisateur
        User user = User.builder()
                .fullName(request.getFullName())
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.PARTICIPANT)
                .build();

        User savedUser = Objects.requireNonNull(userRepository.save(user), "Utilisateur non trouvé");

        // Générer le token JWT
        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole().name())
                .build();
    }

    /**
     * Connexion d'un utilisateur existant.
     */
    public AuthResponse login(@NonNull LoginRequest request) {
        String email = requireNonNullString(request.getEmail(), "Email must not be null");
        String password = requireNonNullString(request.getPassword(), "Password must not be null");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        Authentication authenticated = requireNonNullAuthentication(authentication);
        SecurityContextHolder.getContext().setAuthentication(authenticated);
        String token = tokenProvider.generateToken(authenticated);

        User user = getRequiredUser(email);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    /**
     * Récupère l'utilisateur courant à partir du contexte de sécurité.
     */
    public @NonNull User getCurrentUser() {
        Authentication authentication = requireNonNullAuthentication(SecurityContextHolder.getContext().getAuthentication());
        String email = requireNonNullString(authentication.getName(), "Authentication name must not be null");
        return getRequiredUser(email);
    }

    private @NonNull User getRequiredUser(@NonNull String email) {
        return requireNonNullUser(userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Utilisateur non trouvé")));
    }

    private @NonNull String requireNonNullString(@Nullable String value, @NonNull String message) {
        return Objects.requireNonNull(value, message);
    }

    private @NonNull Authentication requireNonNullAuthentication(@Nullable Authentication authentication) {
        return Objects.requireNonNull(authentication, "Authentication context is missing");
    }

    private @NonNull User requireNonNullUser(@Nullable User user) {
        return Objects.requireNonNull(user, "Utilisateur non trouvé");
    }
}
