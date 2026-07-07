package com.feedback360.service;

import com.feedback360.dto.FeedbackCreateDTO;
import com.feedback360.dto.FeedbackDTO;
import com.feedback360.entity.*;
import com.feedback360.exception.BadRequestException;
import com.feedback360.exception.ResourceNotFoundException;
import com.feedback360.mapper.FeedbackMapper;
import com.feedback360.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

/**
 * Service pour la gestion des feedbacks.
 */
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final TrainingSessionRepository sessionRepository;
    private final SuiviFeedbackRepository suiviFeedbackRepository;
    private final FeedbackMapper feedbackMapper;

    /**
     * Soumet un nouveau feedback.
     * Met à jour le SuiviFeedback correspondant en SOUMIS.
     */
    @Transactional
    public FeedbackDTO createFeedback(FeedbackCreateDTO dto, User currentUser) {
        Long sessionId = Objects.requireNonNull(dto.getSessionId(), "Session id must not be null");
        Long userId = Objects.requireNonNull(currentUser.getId(), "User id must not be null");
        TrainingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session", "id", sessionId));

        // Vérifier si un feedback existe déjà pour cet utilisateur et cette session
        if (!feedbackRepository.findByTrainingSessionIdAndUserId(sessionId, userId).isEmpty()) {
            throw new BadRequestException("Vous avez déjà soumis un feedback pour cette session");
        }

        // Créer le feedback
        Feedback feedback = Feedback.builder()
                .comment(dto.getComment())
                .rating(dto.getRating())
                .status(FeedbackStatus.SOUMIS)
                .user(currentUser)
                .trainingSession(session)
                .build();

        Feedback safeFeedback = Objects.requireNonNull(feedback, "Feedback must not be null");
        feedback = feedbackRepository.save(safeFeedback);

        // Mettre à jour le SuiviFeedback
        suiviFeedbackRepository.findByUserIdAndTrainingSessionId(userId, sessionId)
                .ifPresent(suivi -> {
                    suivi.setStatus(FeedbackStatus.SOUMIS);
                    suiviFeedbackRepository.save(suivi);
                });

        return feedbackMapper.toDTO(feedback);
    }

    /**
     * Récupère les feedbacks d'une session.
     */
    public Page<FeedbackDTO> getFeedbacksBySession(Long sessionId, Pageable pageable) {
        Long safeSessionId = Objects.requireNonNull(sessionId, "Session id must not be null");
        Pageable safePageable = Objects.requireNonNull(pageable, "Pageable must not be null");
        return feedbackRepository.findByTrainingSessionId(safeSessionId, safePageable)
                .map(feedbackMapper::toDTO);
    }

    /**
     * Récupère les feedbacks d'un utilisateur.
     */
    public Page<FeedbackDTO> getFeedbacksByUser(Long userId, Pageable pageable) {
        Long safeUserId = Objects.requireNonNull(userId, "User id must not be null");
        Pageable safePageable = Objects.requireNonNull(pageable, "Pageable must not be null");
        return feedbackRepository.findByUserId(safeUserId, safePageable)
                .map(feedbackMapper::toDTO);
    }
}
