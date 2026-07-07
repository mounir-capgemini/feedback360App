package com.feedback360.controller;

import com.feedback360.dto.AuthResponse;
import com.feedback360.dto.LoginRequest;
import com.feedback360.dto.RegisterRequest;
import com.feedback360.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur d'authentification.
 * Endpoints publics pour l'inscription et la connexion.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "API d'authentification (login, register)")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un nouvel utilisateur")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody @NonNull RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion d'un utilisateur")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody @NonNull LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
