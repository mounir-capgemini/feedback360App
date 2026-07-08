package com.feedback360.controller;

import com.feedback360.dto.TrainingSessionDTO;
import com.feedback360.entity.User;
import com.feedback360.service.AuthService;
import com.feedback360.service.TrainingSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour les sessions de formation.
 */
@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Tag(name = "Sessions", description = "API de gestion des sessions de formation")
public class TrainingSessionController {

    private final TrainingSessionService sessionService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Lister toutes les sessions avec pagination, recherche et tri")
    public ResponseEntity<Page<TrainingSessionDTO>> getAllSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TrainingSessionDTO> sessions = sessionService.getAllSessions(search, pageable);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une session par ID")
    public ResponseEntity<TrainingSessionDTO> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PARTICIPANT')")
    @Operation(summary = "Récupère les sessions assignées au participant connecté")
    public ResponseEntity<List<TrainingSessionDTO>> getMySessionsAsParticipant() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(sessionService.getParticipantSessions(currentUser.getId()));
    }

    @GetMapping("/public")
    @Operation(summary = "Récupère la liste publique des sessions (sans authentification)")
    public ResponseEntity<Page<TrainingSessionDTO>> getPublicSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(sessionService.getPublicSessions(pageable));
    }
}
