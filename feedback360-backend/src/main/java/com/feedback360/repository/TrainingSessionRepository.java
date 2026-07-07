package com.feedback360.repository;

import com.feedback360.entity.TrainingSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository pour l'entité TrainingSession.
 */
@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {

    Optional<TrainingSession> findByTalentUpModuleId(Long talentUpModuleId);

    boolean existsByTalentUpModuleId(Long talentUpModuleId);

    @Query("SELECT ts FROM TrainingSession ts WHERE " +
           "LOWER(ts.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(ts.typeLabel) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<TrainingSession> searchSessions(@Param("search") String search, Pageable pageable);

    Page<TrainingSession> findByParcoursId(Long parcoursId, Pageable pageable);

    Page<TrainingSession> findByPopulationId(Long populationId, Pageable pageable);
}
