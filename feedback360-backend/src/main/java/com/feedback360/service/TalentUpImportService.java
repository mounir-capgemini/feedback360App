package com.feedback360.service;

import com.feedback360.dto.TalentUpImportDTO;
import com.feedback360.entity.*;
import com.feedback360.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Service d'import des données depuis TalentUp.
 * Vérifie l'existence des entités, crée les éléments inexistants,
 * et initialise le suivi de feedback et les notifications.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TalentUpImportService {

    private final UserRepository userRepository;
    private final TrainingSessionRepository trainingSessionRepository;
    private final ParcoursRepository parcoursRepository;
    private final PopulationRepository populationRepository;
    private final SuiviFeedbackRepository suiviFeedbackRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    private static <T> T requireNonNull(@Nullable T object, String message) {
        return Objects.requireNonNull(object, message);
    }

    /**
     * Importe les données depuis TalentUp.
     * Logique :
     * 1. Vérifier/créer User
     * 2. Vérifier/créer Parcours
     * 3. Vérifier/créer Population
     * 4. Vérifier/créer TrainingSession (Module), associer au Parcours et Population
     * 5. Créer SuiviFeedback (EN_ATTENTE)
     * 6. Créer Notification (FEEDBACK_REQUEST, PENDING)
     */
    @Transactional
    public Map<String, Object> importFromTalentUp(TalentUpImportDTO dto) {
        log.info("Import TalentUp démarré pour l'utilisateur: {}", dto.getUser().getEmail());

        Map<String, Object> result = new HashMap<>();

        // 1. Vérifier/créer User
        User user = requireNonNull(
                userRepository.findByTalentUpUserId(dto.getUser().getId())
                        .orElseGet(() -> {
                            log.info("Création d'un nouvel utilisateur TalentUp: {}", dto.getUser().getEmail());
                            User newUser = User.builder()
                                    .talentUpUserId(dto.getUser().getId())
                                    .email(dto.getUser().getEmail())
                                    .fullName(dto.getUser().getFullName())
                                    .password(passwordEncoder.encode("TalentUp2024!"))
                                    .role(Role.PARTICIPANT)
                                    .build();
                            User safeNewUser = Objects.requireNonNull(newUser, "User ne peut pas être null");
                            return userRepository.save(safeNewUser);
                        }),
                "User ne peut pas être null"
        );
        result.put("user", user.getFullName());
        result.put("userCreated", !userRepository.existsByTalentUpUserId(dto.getUser().getId()));

        // 2. Vérifier/créer Parcours
        Parcours parcours = requireNonNull(
                parcoursRepository.findByTalentUpParcoursId(dto.getParcours().getId())
                        .orElseGet(() -> {
                            log.info("Création d'un nouveau parcours: {}", dto.getParcours().getName());
                            Parcours newParcours = Parcours.builder()
                                    .talentUpParcoursId(dto.getParcours().getId())
                                    .name(dto.getParcours().getName())
                                    .build();
                            Parcours safeNewParcours = Objects.requireNonNull(newParcours, "Parcours ne peut pas être null");
                            return parcoursRepository.save(safeNewParcours);
                        }),
                "Parcours ne peut pas être null"
        );
        result.put("parcours", parcours.getName());

        // 3. Vérifier/créer Population
        Population population = requireNonNull(
                populationRepository.findByTalentUpPopulationId(dto.getPopulation().getId())
                        .orElseGet(() -> {
                            log.info("Création d'une nouvelle population: {}", dto.getPopulation().getName());
                            Population newPopulation = Population.builder()
                                    .talentUpPopulationId(dto.getPopulation().getId())
                                    .name(dto.getPopulation().getName())
                                    .build();
                            Population safeNewPopulation = Objects.requireNonNull(newPopulation, "Population ne peut pas être null");
                            return populationRepository.save(safeNewPopulation);
                        }),
                "Population ne peut pas être null"
        );
        result.put("population", population.getName());

        // 4. Vérifier/créer TrainingSession (Module)
        TrainingSession session = requireNonNull(
                trainingSessionRepository.findByTalentUpModuleId(dto.getModule().getId())
                        .orElseGet(() -> {
                            log.info("Création d'une nouvelle session: {}", dto.getModule().getName());
                            TrainingSession newSession = TrainingSession.builder()
                                    .talentUpModuleId(dto.getModule().getId())
                                    .name(dto.getModule().getName())
                                    .typeLabel(dto.getModule().getType() != null ? dto.getModule().getType().getLabel() : null)
                                    .typeId(dto.getModule().getType() != null ? dto.getModule().getType().getId() : null)
                                    .parcours(parcours)
                                    .population(population)
                                    .build();
                            TrainingSession safeNewSession = Objects.requireNonNull(newSession, "TrainingSession ne peut pas être null");
                            return trainingSessionRepository.save(safeNewSession);
                        }),
                "TrainingSession ne peut pas être null"
        );

        // Mettre à jour les associations si la session existait déjà
        session.setParcours(Objects.requireNonNull(parcours, "Parcours ne peut pas être null"));
        session.setPopulation(Objects.requireNonNull(population, "Population ne peut pas être null"));
        TrainingSession safeSession = Objects.requireNonNull(session, "TrainingSession ne peut pas être null");
        trainingSessionRepository.save(safeSession);
        result.put("session", Objects.requireNonNull(session.getName(), "Session name ne peut pas être null"));

        // 5. Créer SuiviFeedback (EN_ATTENTE)
        SuiviFeedback suiviFeedback = createSuiviFeedback(user, session);
        SuiviFeedback safeSuiviFeedback = Objects.requireNonNull(suiviFeedback, "SuiviFeedback ne peut pas être null");
        suiviFeedbackRepository.save(safeSuiviFeedback);
        result.put("suiviFeedbackId", Objects.requireNonNull(suiviFeedback.getId(), "SuiviFeedback id ne peut pas être null"));

        // 6. Créer Notification (FEEDBACK_REQUEST, PENDING)
        Notification notification = createNotification(user, session);
        Notification safeNotification = Objects.requireNonNull(notification, "Notification ne peut pas être null");
        notificationRepository.save(safeNotification);
        result.put("notificationId", Objects.requireNonNull(notification.getId(), "Notification id ne peut pas être null"));

        result.put("status", "SUCCESS");
        log.info("Import TalentUp terminé avec succès pour: {}", user.getEmail());

        return result;
    }

    private SuiviFeedback createSuiviFeedback(User user, TrainingSession session) {
        User safeUser = Objects.requireNonNull(user, "User ne peut pas être null");
        TrainingSession safeSession = Objects.requireNonNull(session, "TrainingSession ne peut pas être null");
        return SuiviFeedback.builder()
                .user(safeUser)
                .trainingSession(safeSession)
                .status(FeedbackStatus.EN_ATTENTE)
                .build();
    }

    private Notification createNotification(User user, TrainingSession session) {
        User safeUser = Objects.requireNonNull(user, "User ne peut pas être null");
        String message = "Nouveau feedback demandé pour la session : " + Objects.requireNonNull(session.getName(), "Session name ne peut pas être null");
        return Notification.builder()
                .user(safeUser)
                .message(message)
                .type(NotificationType.FEEDBACK_REQUEST)
                .status(NotificationStatus.PENDING)
                .build();
    }
}
