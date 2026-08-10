package com.feedback360.repository;

import com.feedback360.entity.SuiviFeedback;
import com.feedback360.entity.FeedbackStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
            SELECT sf FROM SuiviFeedback sf
            JOIN FETCH sf.user u
            JOIN FETCH sf.trainingSession s
            WHERE (:userName IS NULL OR :userName = '' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :userName, '%')))
              AND (:trainingName IS NULL OR :trainingName = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :trainingName, '%')))
              AND (:status IS NULL OR sf.status = :status)
            ORDER BY u.fullName, s.name
            """)
    List<SuiviFeedback> search(@Param("userName") String userName,
                                @Param("trainingName") String trainingName,
                                @Param("status") FeedbackStatus status);
}
