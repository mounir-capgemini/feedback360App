package com.feedback360.repository;

import com.feedback360.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository pour l'entité User.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByTalentUpUserId(Long talentUpUserId);

    boolean existsByEmail(String email);

    boolean existsByTalentUpUserId(Long talentUpUserId);
}
