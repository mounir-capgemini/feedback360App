package com.feedback360.controller;

import com.feedback360.dto.NotificationDTO;
import com.feedback360.entity.User;
import com.feedback360.service.AuthService;
import com.feedback360.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Contrôleur pour les notifications.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "API de gestion des notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister toutes les notifications (Admin uniquement)")
    public ResponseEntity<Page<NotificationDTO>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(notificationService.getAllNotifications(pageable));
    }

    @GetMapping
    @Operation(summary = "Mes notifications")
    public ResponseEntity<Page<NotificationDTO>> getMyNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User currentUser = authService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(notificationService.getNotificationsByUser(currentUser.getId(), pageable));
    }

    @GetMapping("/count")
    @Operation(summary = "Nombre de notifications en attente")
    public ResponseEntity<Map<String, Long>> getPendingCount() {
        User currentUser = authService.getCurrentUser();
        long count = notificationService.countPendingNotifications(currentUser.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Marquer une notification comme lue")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        notificationService.markAsSent(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
