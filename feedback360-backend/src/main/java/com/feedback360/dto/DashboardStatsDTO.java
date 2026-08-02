package com.feedback360.dto;

import lombok.*;

/**
 * DTO pour les statistiques du dashboard.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {

    private long totalUsers;
    private long totalSessions;
    private long totalFeedbacks;
    private long pendingFeedbacks;
    private long submittedFeedbacks;
    private long totalNotifications;
    private long pendingNotifications;
    private double averageRating;
    @Builder.Default
    private java.util.List<SessionFeedbackStat> feedbacksBySession = new java.util.ArrayList<>();
    @Builder.Default
    private java.util.List<RatingDistribution> ratingDistribution = new java.util.ArrayList<>();
    @Builder.Default
    private java.util.List<MonthlyFeedback> monthlyFeedbacks = new java.util.ArrayList<>();
    @Builder.Default
    private java.util.List<UserTrainingProgress> userTrainingProgress = new java.util.ArrayList<>();

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SessionFeedbackStat {
        private String sessionName;
        private long feedbackCount;
        private double averageRating;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RatingDistribution {
        private int rating;
        private long count;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyFeedback {
        private String month;
        private long count;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserTrainingProgress {
        private String userName;
        private String trainingName;
        private boolean completed;
        private double progress;
    }
}
