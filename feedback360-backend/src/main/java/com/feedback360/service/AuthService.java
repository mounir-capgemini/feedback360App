package com.feedback360.service;

import com.feedback360.dto.AuthResponse;
import com.feedback360.dto.LoginRequest;
import com.feedback360.dto.ProfileUpdateDTO;
import com.feedback360.dto.RegisterRequest;
import com.feedback360.dto.UserAdminUpdateDTO;
import com.feedback360.dto.UserDTO;
import com.feedback360.entity.Role;
import com.feedback360.exception.ResourceNotFoundException;
import com.feedback360.entity.User;
import com.feedback360.exception.BadRequestException;
import com.feedback360.repository.UserRepository;
import com.feedback360.security.JwtTokenProvider;
import com.feedback360.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final UserMapper userMapper;

    /**
     * Inscription d'un nouvel utilisateur.
     * Le rôle par défaut est PARTICIPANT (inscription publique).
     * Les rôles ADMIN et GESTIONNAIRE ne peuvent être créés que via l'endpoint admin.
     */
    @SuppressWarnings("null")
    public AuthResponse register(@NonNull RegisterRequest request) {
        String email = requireNonNullString(request.getEmail(), "Email must not be null");
        String password = requireNonNullString(request.getPassword(), "Password must not be null");

        // Vérifier si l'email est déjà utilisé
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Cet email est déjà utilisé");
        }

        // Créer le nouvel utilisateur - toujours PARTICIPANT pour l'inscription publique
        User user = User.builder()
                .fullName(request.getFullName())
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.PARTICIPANT)
                .build();

        User savedUser = requireNonNullUser(userRepository.save(user));

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
     * Création d'un utilisateur par un administrateur.
     * Seuls les rôles ADMIN et GESTIONNAIRE peuvent être créés.
     * Le rôle PARTICIPANT est interdit (les participants sont créés via TalentUp).
     */
    @SuppressWarnings("null")
    public AuthResponse createUserByAdmin(@NonNull RegisterRequest request) {
        String email = requireNonNullString(request.getEmail(), "Email must not be null");
        String password = requireNonNullString(request.getPassword(), "Password must not be null");

        // Vérifier si l'email est déjà utilisé
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Cet email est déjà utilisé");
        }

        // Déterminer le rôle - par défaut GESTIONNAIRE
        Role role = request.getRole() != null ? request.getRole() : Role.GESTIONNAIRE;

        // Interdire la création de participants via l'admin
        if (role == Role.PARTICIPANT) {
            throw new BadRequestException("Les participants sont créés automatiquement via l'intégration TalentUp");
        }

        // Créer le nouvel utilisateur
        User user = User.builder()
                .fullName(request.getFullName())
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();

        User savedUser = requireNonNullUser(userRepository.save(user));

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

    private @NonNull User requireNonNullUser(User user) {
        return Objects.requireNonNull(user, "Utilisateur non trouvé");
    }

    /**
     * Récupère la liste de tous les utilisateurs (pour l'admin).
     */
    public Page<UserDTO> getAllUsers(String search, Role role, @NonNull Pageable pageable) {
        Pageable safePageable = Objects.requireNonNull(pageable, "Pageable must not be null");
        return userRepository.search(search, role, safePageable).map(userMapper::toDTO);
    }

    @Transactional
    @SuppressWarnings("null")
    public UserDTO updateUserByAdmin(Long userId, UserAdminUpdateDTO dto) {
        User user = userRepository.findById(Objects.requireNonNull(userId, "userId must not be null"))
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }

        if (dto.getEnabled() != null) {
            user.setEnabled(dto.getEnabled());
        }

        return userMapper.toDTO(Objects.requireNonNull(userRepository.save(user), "Saved user must not be null"));
    }

    /**
     * Met à jour le profil de l'utilisateur.
     */
    @Transactional
    public UserDTO updateProfile(ProfileUpdateDTO dto, User currentUser) {
        // Si l'email change, vérifier qu'il n'est pas déjà pris
        if (!currentUser.getEmail().equalsIgnoreCase(dto.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new BadRequestException("Cet email est déjà utilisé par un autre compte");
            }
            currentUser.setEmail(dto.getEmail());
        }

        currentUser.setFullName(dto.getFullName());
        
        if (dto.getPhoto() != null) {
            currentUser.setPhoto(dto.getPhoto());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            currentUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User saved = userRepository.save(currentUser);
        return userMapper.toDTO(saved);
    }
}
