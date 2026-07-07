-- =============================================
-- Feedback360 — Script d'initialisation V1
-- Base de données MySQL
-- =============================================

-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    talent_up_user_id BIGINT UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'PARTICIPANT',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_talent_up_id (talent_up_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des parcours
CREATE TABLE parcours (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    talent_up_parcours_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_parcours_talent_up_id (talent_up_parcours_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des populations
CREATE TABLE populations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    talent_up_population_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_populations_talent_up_id (talent_up_population_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des sessions de formation (modules TalentUp)
CREATE TABLE training_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    talent_up_module_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    type_label VARCHAR(255),
    type_id BIGINT,
    parcours_id BIGINT,
    population_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_parcours FOREIGN KEY (parcours_id) REFERENCES parcours(id) ON DELETE SET NULL,
    CONSTRAINT fk_session_population FOREIGN KEY (population_id) REFERENCES populations(id) ON DELETE SET NULL,
    INDEX idx_sessions_talent_up_id (talent_up_module_id),
    INDEX idx_sessions_parcours (parcours_id),
    INDEX idx_sessions_population (population_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des feedbacks
CREATE TABLE feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    comment TEXT,
    rating INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    user_id BIGINT NOT NULL,
    training_session_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_session FOREIGN KEY (training_session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
    INDEX idx_feedbacks_user (user_id),
    INDEX idx_feedbacks_session (training_session_id),
    INDEX idx_feedbacks_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des notifications
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'FEEDBACK_REQUEST',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table de suivi des feedbacks
CREATE TABLE suivi_feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    user_id BIGINT NOT NULL,
    training_session_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    CONSTRAINT fk_suivi_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_suivi_session FOREIGN KEY (training_session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
    INDEX idx_suivi_user (user_id),
    INDEX idx_suivi_session (training_session_id),
    INDEX idx_suivi_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Données initiales
-- =============================================

-- Admin par défaut (mot de passe: Admin123!)
-- BCrypt hash de "Admin123!"
INSERT INTO users (email, full_name, password, role, created_at) VALUES
('admin@feedback360.com', 'Administrateur', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NOW());

-- Parcours de démonstration
INSERT INTO parcours (talent_up_parcours_id, name, created_at) VALUES
(11, 'Talent Up', NOW());

-- Population de démonstration
INSERT INTO populations (talent_up_population_id, name, created_at) VALUES
(1, 'Angular', NOW());

-- Session de démonstration
INSERT INTO training_sessions (talent_up_module_id, name, type_label, type_id, parcours_id, population_id, created_at) VALUES
(192, 'Angular Fundamentals', 'Apprentissage_TU', 1, 1, 1, NOW());
