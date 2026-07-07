package com.feedback360.controller;

import com.feedback360.dto.TalentUpImportDTO;
import com.feedback360.service.TalentUpImportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Contrôleur pour l'import de données depuis TalentUp.
 * Endpoint public (pas d'authentification requise).
 */
@RestController
@RequestMapping("/api/talentup")
@RequiredArgsConstructor
@Tag(name = "TalentUp Import", description = "API d'import de données depuis TalentUp")
public class TalentUpController {

    private final TalentUpImportService importService;

    @PostMapping("/import")
    @Operation(summary = "Importer des données depuis TalentUp",
               description = "Reçoit un JSON de TalentUp, vérifie/crée les entités, initialise le suivi de feedback et la notification")
    public ResponseEntity<Map<String, Object>> importFromTalentUp(
            @Valid @RequestBody TalentUpImportDTO dto) {
        Map<String, Object> result = importService.importFromTalentUp(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
