package com.feedback360.controller;

import com.feedback360.dto.FeedbackCreateDTO;
import com.feedback360.dto.FeedbackDTO;
import com.feedback360.entity.User;
import com.feedback360.service.AuthService;
import com.feedback360.service.FeedbackService;
import com.feedback360.service.ExcelExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur pour la gestion des feedbacks.
 */
@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@Tag(name = "Feedbacks", description = "API de gestion des feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final AuthService authService;
    private final ExcelExportService excelExportService;

    @PostMapping
    @Operation(summary = "Soumettre un nouveau feedback")
    public ResponseEntity<FeedbackDTO> createFeedback(@Valid @RequestBody FeedbackCreateDTO dto) {
        User currentUser = authService.getCurrentUser();
        FeedbackDTO feedback = feedbackService.createFeedback(dto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister tous les feedbacks (Admin uniquement)")
    public ResponseEntity<Page<FeedbackDTO>> getAllFeedbacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(feedbackService.getAllFeedbacks(pageable));
    }

    @GetMapping("/session/{sessionId}")
    @Operation(summary = "Feedbacks d'une session")
    public ResponseEntity<Page<FeedbackDTO>> getFeedbacksBySession(
            @PathVariable Long sessionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(feedbackService.getFeedbacksBySession(sessionId, pageable));
    }

    @GetMapping("/my")
    @Operation(summary = "Mes feedbacks")
    public ResponseEntity<Page<FeedbackDTO>> getMyFeedbacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User currentUser = authService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(feedbackService.getFeedbacksByUser(currentUser.getId(), pageable));
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Exporter tous les feedbacks en format Excel (Admin uniquement)")
    public ResponseEntity<byte[]> exportFeedbacksToExcel() {
        try {
            byte[] excelContent = excelExportService.exportFeedbacksToExcel();
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDisposition(org.springframework.http.ContentDisposition.builder("attachment")
                    .filename("feedbacks_report.xlsx")
                    .build());
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(excelContent, headers, HttpStatus.OK);
        } catch (java.io.IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
