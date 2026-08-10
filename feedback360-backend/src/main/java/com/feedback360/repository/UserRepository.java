package com.feedback360.repository;

import com.feedback360.entity.User;
import com.feedback360.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
            SELECT u FROM User u
            WHERE (CAST(:search AS string) IS NULL
                   OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
              AND (:role IS NULL OR u.role = :role)
            """)
    Page<User> search(@Param("search") String search, @Param("role") Role role, Pageable pageable);
}
