package com.feedback360.config;

import com.feedback360.entity.Role;
import com.feedback360.entity.User;
import com.feedback360.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DefaultUserSeederTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private DefaultUserSeeder defaultUserSeeder;

    @Test
    void shouldSeedDefaultAdminWhenNoUserExists() {
        when(userRepository.existsByEmail("admin@feedback360.com")).thenReturn(false);
        when(passwordEncoder.encode("admin123")).thenReturn("encoded-password");

        defaultUserSeeder.run(new DefaultApplicationArguments(new String[0]));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getEmail()).isEqualTo("admin@feedback360.com");
        assertThat(savedUser.getFullName()).isEqualTo("Administrator");
        assertThat(savedUser.getPassword()).isEqualTo("encoded-password");
        assertThat(savedUser.getRole()).isEqualTo(Role.ADMIN);
    }
}
