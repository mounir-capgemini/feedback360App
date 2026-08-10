package com.feedback360.controller;

import com.feedback360.entity.TrainingSession;
import com.feedback360.entity.User;
import com.feedback360.repository.TrainingSessionRepository;
import com.feedback360.repository.UserRepository;
import com.feedback360.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Contrôleur d'envoi d'emails.
 * Endpoint public pour déclencher l'envoi d'un email de demande de feedback
 * à un participant après la fin de sa formation.
 */
@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@Tag(name = "Email", description = "API d'envoi d'emails de feedback")
public class EmailController {

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final TrainingSessionRepository trainingSessionRepository;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @PostMapping("/send-feedback-request")
    @Operation(summary = "Envoyer un email de demande de feedback",
               description = "Envoie un email HTML au participant pour l'inviter à donner son avis sur sa formation terminée")
    public ResponseEntity<Map<String, Object>> sendFeedbackRequestEmail(
            @RequestParam @NonNull Long userId,
            @RequestParam @NonNull Long sessionId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + userId));

        TrainingSession session = trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable avec l'ID : " + sessionId));

        emailService.sendFeedbackRequestEmail(user, session);

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Email de demande de feedback envoyé à " + user.getEmail()
        ));
    }

    @PostMapping("/send-talentup-invitation")
    @Operation(summary = "Envoyer une invitation TalentUp",
               description = "Envoie un email de création de compte au participant TalentUp")
    public ResponseEntity<Map<String, Object>> sendTalentUpInvitationEmail(
            @RequestParam @NonNull Long userId,
            @RequestParam @NonNull Long sessionId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + userId));

        TrainingSession session = trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable avec l'ID : " + sessionId));

        String invitationLink = frontendUrl + "/login";
        emailService.sendTalentUpInvitationEmail(user, session, invitationLink);

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Email d'invitation TalentUp envoyé à " + user.getEmail()
        ));
    }
}
