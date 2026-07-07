package com.feedback360.repository;

import com.feedback360.entity.Population;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository pour l'entité Population.
 */
@Repository
public interface PopulationRepository extends JpaRepository<Population, Long> {

    Optional<Population> findByTalentUpPopulationId(Long talentUpPopulationId);

    boolean existsByTalentUpPopulationId(Long talentUpPopulationId);
}
