package dev.skypea.mic_mydocs.auth.domain.port.out;

import dev.skypea.mic_mydocs.auth.domain.model.User;

import java.util.Optional;

public interface GoogleTokenValidator {
    Optional<User> validate(String accessToken);
}
