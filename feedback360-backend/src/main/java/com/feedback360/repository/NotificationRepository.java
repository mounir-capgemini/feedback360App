package com.feedback360.repository;

import com.feedback360.entity.Notification;
import com.feedback360.entity.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour l'entité Notification.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByUserIdAndStatus(Long userId, NotificationStatus status);

    long countByStatus(NotificationStatus status);
}
