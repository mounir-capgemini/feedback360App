package com.feedback360.repository;

import com.feedback360.entity.Feedback;
import com.feedback360.entity.FeedbackStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour l'entité Feedback.
 */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    Page<Feedback> findByTrainingSessionId(Long sessionId, Pageable pageable);

    Page<Feedback> findByUserId(Long userId, Pageable pageable);

    List<Feedback> findByTrainingSessionIdAndUserId(Long sessionId, Long userId);

    long countByStatus(FeedbackStatus status);

    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double findAverageRating();

    @Query("SELECT f.rating, COUNT(f) FROM Feedback f GROUP BY f.rating ORDER BY f.rating")
    List<Object[]> findRatingDistribution();

    @Query(value = "SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, COUNT(*) AS count " +
                   "FROM feedbacks GROUP BY TO_CHAR(created_at, 'YYYY-MM') " +
                   "ORDER BY month", nativeQuery = true)
    List<Object[]> findMonthlyFeedbackCounts();

    @Query("SELECT f.trainingSession.name, COUNT(f), AVG(f.rating) " +
           "FROM Feedback f GROUP BY f.trainingSession.name")
    List<Object[]> findFeedbackStatsBySession();

    @Query("""
            SELECT f FROM Feedback f
            JOIN f.user u
            JOIN f.trainingSession s
            WHERE (:participant IS NULL OR :participant = '' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :participant, '%')))
              AND (:session IS NULL OR :session = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :session, '%')))
            """)
    Page<Feedback> search(@Param("participant") String participant,
                          @Param("session") String session,
                          Pageable pageable);
}
