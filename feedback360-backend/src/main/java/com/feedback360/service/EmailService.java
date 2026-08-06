package com.feedback360.service;

import com.feedback360.entity.TrainingSession;
import com.feedback360.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * Service d'envoi d'emails.
 * Envoie un email HTML au participant pour l'inviter à donner son feedback
 * après la fin de sa formation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:feedback360.app@gmail.com}")
    private String fromEmail;

    /**
     * Envoie un email de demande de feedback au participant.
     *
     * @param user    le participant
     * @param session la formation terminée
     */
    public void sendFeedbackRequestEmail(User user, TrainingSession session) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Votre formation est terminée - Donnez votre avis");

            String emailLink = frontendUrl + "/email/feedback";
            String htmlContent = buildHtmlContent(user, session, emailLink);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email de feedback envoyé à : {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email à {} : {}", user.getEmail(), e.getMessage());
        }
    }

    private String buildHtmlContent(User user, TrainingSession session, String emailLink) {
        return """
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { background: #f3f5f7; font-family: "Segoe UI", sans-serif; }
                        .email-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 30px; }
                        .email-card { width: 520px; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,.15); }
                        .email-header { background: #0B5ED7; color: white; padding: 18px 25px; }
                        .logo { font-size: 24px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
                        .email-body { padding: 35px; }
                        .email-body h2 { color: #2c3e50; margin-bottom: 25px; text-align: center; }
                        .formation-box { background: #f8f9fa; border-left: 5px solid #0B5ED7; padding: 18px; border-radius: 8px; margin-bottom: 25px; }
                        .formation-box p { margin-bottom: 10px; color: #444; }
                        .message { color: #555; text-align: center; margin-bottom: 15px; line-height: 1.6; }
                        .btn-feedback { display: block; margin: 35px auto; padding: 14px 45px; background: #0B5ED7; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 17px; font-weight: 600; text-decoration: none; text-align: center; transition: .3s; }
                        .btn-feedback:hover { background: #084bb4; transform: translateY(-2px); }
                        .email-footer { background: #f5f5f5; padding: 18px; text-align: center; color: #666; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="email-page">
                        <div class="email-card">
                            <div class="email-header">
                                <div class="logo">🎓 <span>TALENTUP</span></div>
                            </div>
                            <div class="email-body">
                                <h2>Votre formation est terminée ✅</h2>
                                <div class="formation-box">
                                    <p><strong>Formation :</strong> %s</p>
                                    <p><strong>Participant :</strong> %s</p>
                                </div>
                                <p class="message">Votre avis nous intéresse.</p>
                                <p class="message">Merci de compléter votre évaluation afin d'améliorer la qualité de nos formations.</p>
                                <a class="btn-feedback" href="%s">OK</a>
                            </div>
                            <div class="email-footer">Équipe TalentUp & Feedback360</div>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(session.getName(), user.getFullName(), emailLink);
    }
}