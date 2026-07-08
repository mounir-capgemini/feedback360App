package com.feedback360.service;

import com.feedback360.dto.TrainingSessionDTO;
import com.feedback360.entity.TrainingSession;
import com.feedback360.entity.SuiviFeedback;
import com.feedback360.exception.ResourceNotFoundException;
import com.feedback360.mapper.TrainingSessionMapper;
import com.feedback360.repository.TrainingSessionRepository;
import com.feedback360.repository.SuiviFeedbackRepository;
import com.feedback360.entity.FeedbackStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Service pour la gestion des sessions de formation.
 */
@Service
@RequiredArgsConstructor
public class TrainingSessionService {

    private final TrainingSessionRepository sessionRepository;
    private final TrainingSessionMapper sessionMapper;

    /**
     * Récupère toutes les sessions avec pagination et recherche optionnelle.
     */
    public Page<TrainingSessionDTO> getAllSessions(String search, Pageable pageable) {
        Pageable safePageable = Objects.requireNonNullElse(pageable, Pageable.unpaged());
        Page<TrainingSession> sessions;

        if (search != null && !search.isBlank()) {
            sessions = searchSessions(search, safePageable);
        } else {
            sessions = findAllSessions(safePageable);
        }

        return sessions.map(session -> {
            TrainingSessionDTO dto = sessionMapper.toDTO(session);
            dto.setFeedbackCount(session.getFeedbacks().size());
            dto.setPendingFeedbackCount(
                    session.getSuiviFeedbacks().stream()
                            .filter(sf -> sf.getStatus() == FeedbackStatus.EN_ATTENTE)
                            .count()
            );
            return dto;
        });
    }

    /**
     * Récupère une session par son ID.
     */
    public TrainingSessionDTO getSessionById(Long id) {
        Long safeId = Objects.requireNonNull(id, "Session id must not be null");
        TrainingSession session = findSessionById(safeId);

        TrainingSessionDTO dto = sessionMapper.toDTO(session);
        dto.setFeedbackCount(session.getFeedbacks().size());
        dto.setPendingFeedbackCount(
                session.getSuiviFeedbacks().stream()
                        .filter(sf -> sf.getStatus() == FeedbackStatus.EN_ATTENTE)
                        .count()
        );
        return dto;
    }

    private Page<TrainingSession> searchSessions(String search, Pageable pageable) {
        Pageable safePageable = Objects.requireNonNull(pageable, "Pageable must not be null");
        return sessionRepository.searchSessions(search, safePageable);
    }

    private Page<TrainingSession> findAllSessions(Pageable pageable) {
        Pageable safePageable = Objects.requireNonNull(pageable, "Pageable must not be null");
        return sessionRepository.findAll(safePageable);
    }

    private TrainingSession findSessionById(Long id) {
        Long safeId = Objects.requireNonNull(id, "Session id must not be null");
        return sessionRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Session", "id", safeId));
    }

    private final SuiviFeedbackRepository suiviFeedbackRepository;

    /**
     * Récupère les sessions assignées à un participant via SuiviFeedback.
     */
    public List<TrainingSessionDTO> getParticipantSessions(Long userId) {
        List<SuiviFeedback> suivis = suiviFeedbackRepository.findByUserId(userId);
        return suivis.stream()
                .map(sf -> {
                    TrainingSession session = sf.getTrainingSession();
                    TrainingSessionDTO dto = sessionMapper.toDTO(session);
                    dto.setFeedbackCount(session.getFeedbacks().size());
                    dto.setPendingFeedbackCount(
                            session.getSuiviFeedbacks().stream()
                                    .filter(s -> s.getStatus() == FeedbackStatus.EN_ATTENTE)
                                    .count()
                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Récupère toutes les sessions publiquement (sans authentification).
     */
    public Page<TrainingSessionDTO> getPublicSessions(@NonNull Pageable pageable) {
        Pageable safePageable = Objects.requireNonNull(pageable, "Pageable must not be null");
        Page<TrainingSession> sessions = sessionRepository.findAll(safePageable);
        return sessions.map(session -> {
            TrainingSessionDTO dto = sessionMapper.toDTO(session);
            dto.setFeedbackCount(session.getFeedbacks().size());
            dto.setPendingFeedbackCount(
                    session.getSuiviFeedbacks().stream()
                            .filter(sf -> sf.getStatus() == FeedbackStatus.EN_ATTENTE)
                            .count()
            );
            return dto;
        });
    }
}
