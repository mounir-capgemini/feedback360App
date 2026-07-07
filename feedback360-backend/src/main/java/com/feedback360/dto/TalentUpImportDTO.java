package com.feedback360.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * DTO pour l'import de données depuis TalentUp.
 * Structure fidèle au JSON envoyé par l'application TalentUp.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TalentUpImportDTO {

    @NotNull(message = "L'utilisateur est obligatoire")
    @Valid
    private TalentUpUser user;

    @NotNull(message = "Le module est obligatoire")
    @Valid
    private TalentUpModule module;

    @NotNull(message = "Le parcours est obligatoire")
    @Valid
    private TalentUpParcours parcours;

    @NotNull(message = "La population est obligatoire")
    @Valid
    private TalentUpPopulation population;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TalentUpUser {
        @NotNull(message = "L'ID utilisateur TalentUp est obligatoire")
        private Long id;
        private String email;
        private String fullName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TalentUpModule {
        @NotNull(message = "L'ID module TalentUp est obligatoire")
        private Long id;
        private String name;
        private TalentUpModuleType type;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TalentUpModuleType {
        private Long id;
        private String label;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TalentUpParcours {
        @NotNull(message = "L'ID parcours TalentUp est obligatoire")
        private Long id;
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TalentUpPopulation {
        @NotNull(message = "L'ID population TalentUp est obligatoire")
        private Long id;
        private String name;
    }
}
