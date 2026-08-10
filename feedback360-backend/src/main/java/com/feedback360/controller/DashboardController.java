package com.feedback360.controller;

import com.feedback360.dto.DashboardStatsDTO;
import com.feedback360.dto.ParticipantDashboardStatsDTO;
import com.feedback360.entity.User;
import com.feedback360.entity.FeedbackStatus;
import com.feedback360.service.AuthService;
import com.feedback360.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur pour le dashboard admin.
 * Accès réservé aux administrateurs.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "API du tableau de bord administrateur")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTIONNAIRE')")
    @Operation(summary = "Statistiques globales du dashboard")
    public ResponseEntity<DashboardStatsDTO> getStatistics(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String trainingName,
            @RequestParam(required = false) FeedbackStatus status) {
        return ResponseEntity.ok(dashboardService.getStatistics(userName, trainingName, status));
    }

    @GetMapping("/participant")
    @PreAuthorize("hasRole('PARTICIPANT')")
    @Operation(summary = "Statistiques pour le tableau de bord participant")
    public ResponseEntity<ParticipantDashboardStatsDTO> getParticipantStatistics() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(dashboardService.getParticipantStatistics(currentUser.getId()));
    }
}
