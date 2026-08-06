package com.feedback360.config;

import com.feedback360.entity.*;
import com.feedback360.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DefaultUserSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final TrainingSessionRepository trainingSessionRepository;
    private final SuiviFeedbackRepository suiviFeedbackRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @SuppressWarnings("null")
    public void run(org.springframework.boot.ApplicationArguments args) {
        if (!userRepository.existsByEmail("admin@feedback360.com")) {
            User admin = User.builder()
                    .fullName("Administrator")
                    .email("admin@feedback360.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("participant@feedback360.com")) {
            User participant = User.builder()
                    .fullName("Participant Test")
                    .email("participant@feedback360.com")
                    .password(passwordEncoder.encode("participant123"))
                    .role(Role.PARTICIPANT)
                    .build();

            User savedParticipant = userRepository.save(participant);

            // Associer à la session Angular Fundamentals (ID 192 de TalentUp)
            Optional<TrainingSession> sessionOpt = trainingSessionRepository.findByTalentUpModuleId(192L);
            if (sessionOpt.isPresent()) {
                TrainingSession session = sessionOpt.get();
                if (!suiviFeedbackRepository.findByUserIdAndTrainingSessionId(savedParticipant.getId(), session.getId()).isPresent()) {
                    SuiviFeedback suivi = SuiviFeedback.builder()
                            .user(savedParticipant)
                            .trainingSession(session)
                            .status(FeedbackStatus.EN_ATTENTE)
                            .build();
                    suiviFeedbackRepository.save(suivi);
                }
                
                // Créer une notification pour le participant si elle n'existe pas
                if (notificationRepository.findByUserIdAndType(savedParticipant.getId(), NotificationType.FEEDBACK_REQUEST).isEmpty()) {
                    Notification notification = Notification.builder()
                            .user(savedParticipant)
                            .message("Nouveau feedback demandé pour la session : " + session.getName())
                            .type(NotificationType.FEEDBACK_REQUEST)
                            .status(NotificationStatus.PENDING)
                            .build();
                    notificationRepository.save(notification);
                }
            }
        }

        seedParticipantIfAbsent("amina.benali@feedback360.com", "Amina Benali", FeedbackStatus.EN_ATTENTE);
        seedParticipantIfAbsent("youssef.diallo@feedback360.com", "Youssef Diallo", FeedbackStatus.SOUMIS);
        seedParticipantIfAbsent("sofia.elamrani@feedback360.com", "Sofia El Amrani", FeedbackStatus.EN_ATTENTE);
        seedParticipantIfAbsent("karim.mansouri@feedback360.com", "Karim Mansouri", FeedbackStatus.SOUMIS);
        seedParticipantIfAbsent("thomas.dubois@feedback360.com", "Thomas Dubois", FeedbackStatus.EN_ATTENTE);
        seedParticipantIfAbsent("sarah.martin@feedback360.com", "Sarah Martin", FeedbackStatus.SOUMIS);
        seedParticipantIfAbsent("mehdi.tazi@feedback360.com", "Mehdi Tazi", FeedbackStatus.EN_ATTENTE);
        seedParticipantIfAbsent("claire.lambert@feedback360.com", "Claire Lambert", FeedbackStatus.EN_ATTENTE);
    }

    @SuppressWarnings("null")
    private void seedParticipantIfAbsent(String email, String fullName, FeedbackStatus status) {
        if (!userRepository.existsByEmail(email)) {
            User participant = User.builder()
                    .fullName(fullName)
                    .email(email)
                    .password(passwordEncoder.encode("participant123"))
                    .role(Role.PARTICIPANT)
                    .build();

            User savedParticipant = Objects.requireNonNull(userRepository.save(participant));

            Optional<TrainingSession> sessionOpt = trainingSessionRepository.findByTalentUpModuleId(192L);
            if (sessionOpt.isPresent()) {
                TrainingSession session = sessionOpt.get();
                if (!suiviFeedbackRepository.findByUserIdAndTrainingSessionId(savedParticipant.getId(), session.getId()).isPresent()) {
                    SuiviFeedback suivi = SuiviFeedback.builder()
                            .user(savedParticipant)
                            .trainingSession(session)
                            .status(status)
                            .build();
                    suiviFeedbackRepository.save(Objects.requireNonNull(suivi));
                }
                
                // Créer une notification pour le participant si elle n'existe pas
                if (notificationRepository.findByUserIdAndType(savedParticipant.getId(), NotificationType.FEEDBACK_REQUEST).isEmpty()) {
                    Notification notification = Notification.builder()
                            .user(savedParticipant)
                            .message("Nouveau feedback demandé pour la session : " + session.getName())
                            .type(NotificationType.FEEDBACK_REQUEST)
                            .status(NotificationStatus.PENDING)
                            .build();
                    notificationRepository.save(notification);
                }
            }
        }
    }
}