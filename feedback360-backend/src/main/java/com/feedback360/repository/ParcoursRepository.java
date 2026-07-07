package com.feedback360.repository;

import com.feedback360.entity.Parcours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository pour l'entité Parcours.
 */
@Repository
public interface ParcoursRepository extends JpaRepository<Parcours, Long> {

    Optional<Parcours> findByTalentUpParcoursId(Long talentUpParcoursId);

    boolean existsByTalentUpParcoursId(Long talentUpParcoursId);
}
