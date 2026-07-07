package com.feedback360.service;

import com.feedback360.dto.NotificationDTO;
import com.feedback360.entity.NotificationStatus;
import com.feedback360.mapper.NotificationMapper;
import com.feedback360.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

/**
 * Service pour la gestion des notifications.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    /**
     * Récupère les notifications d'un utilisateur avec pagination.
     */
    public Page<NotificationDTO> getNotificationsByUser(Long userId, Pageable pageable) {
        Long safeUserId = Objects.requireNonNull(userId, "User id must not be null");
        Pageable safePageable = Objects.requireNonNull(pageable, "Pageable must not be null");
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(safeUserId, safePageable)
                .map(notificationMapper::toDTO);
    }

    /**
     * Compte les notifications en attente pour un utilisateur.
     */
    public long countPendingNotifications(Long userId) {
        Long safeUserId = Objects.requireNonNull(userId, "User id must not be null");
        return notificationRepository.countByUserIdAndStatus(safeUserId, NotificationStatus.PENDING);
    }

    /**
     * Marque une notification comme envoyée.
     */
    @Transactional
    public void markAsSent(Long notificationId) {
        Long safeNotificationId = Objects.requireNonNull(notificationId, "Notification id must not be null");
        notificationRepository.findById(safeNotificationId)
                .ifPresent(notification -> {
                    notification.setStatus(NotificationStatus.SENT);
                    notificationRepository.save(notification);
                });
    }
}
