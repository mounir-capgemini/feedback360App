-- =============================================
-- Migration V3 — Ajout des colonnes trainer et description à training_sessions
-- =============================================

ALTER TABLE training_sessions ADD COLUMN description TEXT;
ALTER TABLE training_sessions ADD COLUMN trainer VARCHAR(255);
