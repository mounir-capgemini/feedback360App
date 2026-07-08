package com.feedback360.service;

import com.feedback360.dto.DashboardStatsDTO;
import com.feedback360.dto.ParticipantDashboardStatsDTO;
import com.feedback360.entity.Feedback;
import com.feedback360.entity.FeedbackStatus;
import com.feedback360.entity.NotificationStatus;
import com.feedback360.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service pour les statistiques du dashboard admin.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final TrainingSessionRepository sessionRepository;
    private final FeedbackRepository feedbackRepository;
    private final NotificationRepository notificationRepository;
    private final SuiviFeedbackRepository suiviFeedbackRepository;

    /**
     * Calcule les statistiques globales pour le dashboard admin.
     */
    public DashboardStatsDTO getStatistics() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // Compteurs globaux
        stats.setTotalUsers(userRepository.count());
        stats.setTotalSessions(sessionRepository.count());
        stats.setTotalFeedbacks(feedbackRepository.count());
        stats.setPendingFeedbacks(feedbackRepository.countByStatus(FeedbackStatus.EN_ATTENTE));
        stats.setSubmittedFeedbacks(feedbackRepository.countByStatus(FeedbackStatus.SOUMIS));
        stats.setTotalNotifications(notificationRepository.count());
        stats.setPendingNotifications(notificationRepository.countByStatus(NotificationStatus.PENDING));

        // Note moyenne
        Double avgRating = feedbackRepository.findAverageRating();
        stats.setAverageRating(avgRating != null ? Math.round(avgRating * 100.0) / 100.0 : 0.0);

        // Distribution des notes
        List<DashboardStatsDTO.RatingDistribution> ratingDist = new ArrayList<>();
        for (Object[] row : feedbackRepository.findRatingDistribution()) {
            ratingDist.add(DashboardStatsDTO.RatingDistribution.builder()
                    .rating((Integer) row[0])
                    .count((Long) row[1])
                    .build());
        }
        stats.setRatingDistribution(ratingDist);

        // Feedbacks par session
        List<DashboardStatsDTO.SessionFeedbackStat> sessionStats = new ArrayList<>();
        for (Object[] row : feedbackRepository.findFeedbackStatsBySession()) {
            sessionStats.add(DashboardStatsDTO.SessionFeedbackStat.builder()
                    .sessionName((String) row[0])
                    .feedbackCount((Long) row[1])
                    .averageRating(Math.round((Double) row[2] * 100.0) / 100.0)
                    .build());
        }
        stats.setFeedbacksBySession(sessionStats);

        // Feedbacks mensuels
        List<DashboardStatsDTO.MonthlyFeedback> monthlyFeedbacks = new ArrayList<>();
        for (Object[] row : feedbackRepository.findMonthlyFeedbackCounts()) {
            monthlyFeedbacks.add(DashboardStatsDTO.MonthlyFeedback.builder()
                    .month((String) row[0])
                    .count((Long) row[1])
                    .build());
        }
        stats.setMonthlyFeedbacks(monthlyFeedbacks);

        return stats;
    }

    /**
     * Calcule les statistiques pour le dashboard participant.
     */
    public ParticipantDashboardStatsDTO getParticipantStatistics(Long userId) {
        long totalSessions = suiviFeedbackRepository.findByUserId(userId).size();
        
        long submitted = feedbackRepository.findByUserId(userId, Pageable.unpaged()).getTotalElements();
        
        long pending = suiviFeedbackRepository.findByUserId(userId).stream()
                .filter(sf -> sf.getStatus() == FeedbackStatus.EN_ATTENTE)
                .count();

        List<ParticipantDashboardStatsDTO.MonthlyFeedbackStat> monthlyFeedbacks = new ArrayList<>();
        
        List<Feedback> userFeedbacks = feedbackRepository.findByUserId(userId, Pageable.unpaged()).getContent();
        java.util.Map<String, Long> monthlyCounts = new java.util.TreeMap<>();
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM");
        for (Feedback f : userFeedbacks) {
            if (f.getCreatedAt() != null) {
                String monthKey = f.getCreatedAt().format(formatter);
                monthlyCounts.put(monthKey, monthlyCounts.getOrDefault(monthKey, 0L) + 1L);
            }
        }
        
        for (java.util.Map.Entry<String, Long> entry : monthlyCounts.entrySet()) {
            monthlyFeedbacks.add(ParticipantDashboardStatsDTO.MonthlyFeedbackStat.builder()
                    .month(entry.getKey())
                    .count(entry.getValue())
                    .build());
        }

        return ParticipantDashboardStatsDTO.builder()
                .totalSessions(totalSessions)
                .submittedFeedbacks(submitted)
                .pendingFeedbacks(pending)
                .monthlyFeedbacks(monthlyFeedbacks)
                .build();
    }
}
