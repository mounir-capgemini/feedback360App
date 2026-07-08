package com.feedback360.dto;

import lombok.*;
import java.util.List;

/**
 * DTO pour les statistiques du tableau de bord participant.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantDashboardStatsDTO {

    private long totalSessions;
    private long submittedFeedbacks;
    private long pendingFeedbacks;
    private List<MonthlyFeedbackStat> monthlyFeedbacks;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyFeedbackStat {
        private String month;
        private long count;
    }
}
