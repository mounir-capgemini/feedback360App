-- =============================================
-- Feedback360 — Script d'initialisation V1
-- Base de données PostgreSQL
-- =============================================

-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    talent_up_user_id BIGINT UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'PARTICIPANT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_talent_up_id ON users (talent_up_user_id);

-- Table des parcours
CREATE TABLE parcours (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    talent_up_parcours_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parcours_talent_up_id ON parcours (talent_up_parcours_id);

-- Table des populations
CREATE TABLE populations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    talent_up_population_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_populations_talent_up_id ON populations (talent_up_population_id);

-- Table des sessions de formation (modules TalentUp)
CREATE TABLE training_sessions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    talent_up_module_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    type_label VARCHAR(255),
    type_id BIGINT,
    parcours_id BIGINT,
    population_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_parcours FOREIGN KEY (parcours_id) REFERENCES parcours(id) ON DELETE SET NULL,
    CONSTRAINT fk_session_population FOREIGN KEY (population_id) REFERENCES populations(id) ON DELETE SET NULL
);

CREATE INDEX idx_sessions_talent_up_id ON training_sessions (talent_up_module_id);
CREATE INDEX idx_sessions_parcours ON training_sessions (parcours_id);
CREATE INDEX idx_sessions_population ON training_sessions (population_id);

-- Table des feedbacks
CREATE TABLE feedbacks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comment TEXT,
    rating INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    user_id BIGINT NOT NULL,
    training_session_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_session FOREIGN KEY (training_session_id) REFERENCES training_sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_feedbacks_user ON feedbacks (user_id);
CREATE INDEX idx_feedbacks_session ON feedbacks (training_session_id);
CREATE INDEX idx_feedbacks_status ON feedbacks (status);

-- Table des notifications
CREATE TABLE notifications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'FEEDBACK_REQUEST',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_status ON notifications (status);

-- Table de suivi des feedbacks
CREATE TABLE suivi_feedbacks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    user_id BIGINT NOT NULL,
    training_session_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_suivi_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_suivi_session FOREIGN KEY (training_session_id) REFERENCES training_sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_suivi_user ON suivi_feedbacks (user_id);
CREATE INDEX idx_suivi_session ON suivi_feedbacks (training_session_id);
CREATE INDEX idx_suivi_status ON suivi_feedbacks (status);

-- =============================================
-- Données initiales
-- =============================================

-- Admin par défaut (mot de passe: admin123)
-- BCrypt hash de "admin123"
INSERT INTO users (email, full_name, password, role, created_at) VALUES
('admin@feedback360.com', 'Administrateur', '$2a$10$rXGvi0chghdgUXiEOSYtwumviNHxhfpV1YiUEYZbG/6Iah64Ua8ma', 'ADMIN', NOW());

-- Parcours de démonstration
INSERT INTO parcours (talent_up_parcours_id, name, created_at) VALUES
(11, 'Talent Up', NOW());

-- Population de démonstration
INSERT INTO populations (talent_up_population_id, name, created_at) VALUES
(1, 'Angular', NOW());

-- Session de démonstration
INSERT INTO training_sessions (talent_up_module_id, name, type_label, type_id, parcours_id, population_id, created_at) VALUES
(192, 'Angular Fundamentals', 'Apprentissage_TU', 1, 1, 1, NOW());
