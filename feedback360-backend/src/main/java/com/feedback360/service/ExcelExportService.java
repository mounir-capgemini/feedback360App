package com.feedback360.service;

import com.feedback360.entity.Feedback;
import com.feedback360.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service pour l'export des rapports de feedbacks en Excel.
 */
@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final FeedbackRepository feedbackRepository;

    /**
     * Génère un fichier Excel contenant la liste complète de tous les feedbacks enregistrés.
     */
    public byte[] exportFeedbacksToExcel() throws IOException {
        List<Feedback> feedbacks = feedbackRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Feedbacks");

            // Configuration de la police et du style d'en-tête
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.BLUE_GREY.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);

            // Titres de colonnes
            String[] columns = {"ID Feedback", "Session de formation", "Formateur", "Note", "Commentaire", "Participant", "Date de soumission"};

            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            int rowIdx = 1;
            for (Feedback feedback : feedbacks) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(feedback.getId());
                row.createCell(1).setCellValue(feedback.getTrainingSession() != null ? feedback.getTrainingSession().getName() : "N/A");
                row.createCell(2).setCellValue(feedback.getTrainingSession() != null && feedback.getTrainingSession().getTrainer() != null ? feedback.getTrainingSession().getTrainer() : "Non spécifié");
                row.createCell(3).setCellValue(feedback.getRating());
                row.createCell(4).setCellValue(feedback.getComment());
                row.createCell(5).setCellValue(feedback.getUser() != null ? feedback.getUser().getFullName() : "Anonyme");
                
                String dateFormatted = feedback.getCreatedAt() != null ? feedback.getCreatedAt().format(formatter) : "";
                row.createCell(6).setCellValue(dateFormatted);
            }

            // Auto-ajustement de la largeur des colonnes
            for (int col = 0; col < columns.length; col++) {
                sheet.autoSizeColumn(col);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
