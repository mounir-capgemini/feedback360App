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
    public DashboardStatsDTO getStatistics(String userName, String trainingName, FeedbackStatus status) {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        try {
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
            try {
                List<Object[]> rows = feedbackRepository.findRatingDistribution();
                if (rows != null) {
                    for (Object[] row : rows) {
                        if (row != null && row.length >= 2 && row[0] != null && row[1] != null) {
                            Number ratingNum = (Number) row[0];
                            Number countNum = (Number) row[1];
                            ratingDist.add(DashboardStatsDTO.RatingDistribution.builder()
                                    .rating(ratingNum.intValue())
                                    .count(countNum.longValue())
                                    .build());
                        }
                    }
                }
            } catch (Exception e) {
                // Ignore query failure fallback
            }
            stats.setRatingDistribution(ratingDist);

            // Feedbacks par session
            List<DashboardStatsDTO.SessionFeedbackStat> sessionStats = new ArrayList<>();
            try {
                List<Object[]> rows = feedbackRepository.findFeedbackStatsBySession();
                if (rows != null) {
                    for (Object[] row : rows) {
                        if (row != null && row.length >= 3 && row[0] != null) {
                            String sessionName = (String) row[0];
                            Number countNum = (Number) row[1];
                            Number avgNum = (Number) row[2];
                            double avg = avgNum != null ? Math.round(avgNum.doubleValue() * 100.0) / 100.0 : 0.0;
                            sessionStats.add(DashboardStatsDTO.SessionFeedbackStat.builder()
                                    .sessionName(sessionName)
                                    .feedbackCount(countNum != null ? countNum.longValue() : 0L)
                                    .averageRating(avg)
                                    .build());
                        }
                    }
                }
            } catch (Exception e) {
                // Ignore query failure fallback
            }
            stats.setFeedbacksBySession(sessionStats);

            // Feedbacks mensuels
            List<DashboardStatsDTO.MonthlyFeedback> monthlyFeedbacks = new ArrayList<>();
            try {
                List<Object[]> rows = feedbackRepository.findMonthlyFeedbackCounts();
                if (rows != null) {
                    for (Object[] row : rows) {
                        if (row != null && row.length >= 2 && row[0] != null && row[1] != null) {
                            monthlyFeedbacks.add(DashboardStatsDTO.MonthlyFeedback.builder()
                                    .month(row[0].toString())
                                    .count(((Number) row[1]).longValue())
                                    .build());
                        }
                    }
                }
            } catch (Exception e) {
                // Ignore query failure fallback
            }
            stats.setMonthlyFeedbacks(monthlyFeedbacks);

            List<DashboardStatsDTO.UserTrainingProgress> trainingProgress = new ArrayList<>();
            try {
                List<com.feedback360.entity.SuiviFeedback> suivis = suiviFeedbackRepository.search(userName, trainingName, status);
                for (com.feedback360.entity.SuiviFeedback suivi : suivis) {
                    if (suivi.getUser() == null || suivi.getTrainingSession() == null) {
                        continue;
                    }
                    boolean completed = suivi.getStatus() == FeedbackStatus.SOUMIS;
                    double progress = completed ? 100.0 : 50.0;
                    trainingProgress.add(DashboardStatsDTO.UserTrainingProgress.builder()
                            .userName(suivi.getUser().getFullName())
                            .trainingName(suivi.getTrainingSession().getName())
                            .completed(completed)
                            .progress(progress)
                            .build());
                }
            } catch (Exception e) {
                // Ignore progress generation failure fallback
            }
            stats.setUserTrainingProgress(trainingProgress);

        } catch (Exception e) {
            // Guarantee a valid stats object is returned
        }

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
