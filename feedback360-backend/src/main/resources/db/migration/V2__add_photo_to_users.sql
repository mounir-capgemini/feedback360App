-- Migration SQL V2 - Ajout de la photo de profil
ALTER TABLE users ADD COLUMN photo TEXT NULL;
