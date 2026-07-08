package com.feedback360.config;

import com.feedback360.entity.*;
import com.feedback360.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DefaultUserSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final TrainingSessionRepository trainingSessionRepository;
    private final SuiviFeedbackRepository suiviFeedbackRepository;
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
            }
        }
    }
}
