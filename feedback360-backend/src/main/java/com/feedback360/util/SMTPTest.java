package com.feedback360.util;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class SMTPTest {

    @Value("${MAIL_HOST:smtp-mail.outlook.com}")
    private String host;
    @Value("${MAIL_PORT:587}")
    private int port;
    @Value("${MAIL_USERNAME:}")
    private String username;
    @Value("${MAIL_PASSWORD:}")
    private String password;

    public void sendTestEmail() throws Exception {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(username));
        message.setRecipients(Message.RecipientType.TO, 
            new InternetAddress[] { new InternetAddress("mounir.abhari@capgemini.com") });
        message.setSubject("Feedback360 Test Email");
        message.setText("Hello from Feedback360! SMTP connection to Outlook works correctly.");

        Transport.send(message);
        System.out.println("������ SMTP test email sent successfully!");
    }
}