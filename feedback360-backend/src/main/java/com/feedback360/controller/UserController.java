package com.feedback360.controller;

import com.feedback360.dto.ProfileUpdateDTO;
import com.feedback360.dto.UserDTO;
import com.feedback360.entity.User;
import com.feedback360.mapper.UserMapper;
import com.feedback360.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur pour la gestion des utilisateurs et du profil.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "API de gestion des utilisateurs et du profil")
public class UserController {

    private final AuthService authService;
    private final UserMapper userMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister tous les utilisateurs (Admin uniquement)")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(authService.getAllUsers(pageable));
    }

    @GetMapping("/profile")
    @Operation(summary = "Récupérer le profil de l'utilisateur connecté")
    public ResponseEntity<UserDTO> getProfile() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(userMapper.toDTO(currentUser));
    }

    @PutMapping("/profile")
    @Operation(summary = "Mettre à jour le profil de l'utilisateur connecté")
    public ResponseEntity<UserDTO> updateProfile(@Valid @RequestBody ProfileUpdateDTO dto) {
        User currentUser = authService.getCurrentUser();
        UserDTO updated = authService.updateProfile(dto, currentUser);
        return ResponseEntity.ok(updated);
    }
}
