package com.feedback360.controller;

import com.feedback360.dto.DashboardStatsDTO;
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

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Statistiques globales du dashboard")
    public ResponseEntity<DashboardStatsDTO> getStatistics() {
        return ResponseEntity.ok(dashboardService.getStatistics());
    }
}
