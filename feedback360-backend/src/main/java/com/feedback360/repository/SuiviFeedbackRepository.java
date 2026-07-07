package com.feedback360.repository;

import com.feedback360.entity.SuiviFeedback;
import com.feedback360.entity.FeedbackStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité SuiviFeedback.
 */
@Repository
public interface SuiviFeedbackRepository extends JpaRepository<SuiviFeedback, Long> {

    List<SuiviFeedback> findByUserId(Long userId);

    List<SuiviFeedback> findByTrainingSessionId(Long sessionId);

    Optional<SuiviFeedback> findByUserIdAndTrainingSessionId(Long userId, Long sessionId);

    long countByStatus(FeedbackStatus status);
}
