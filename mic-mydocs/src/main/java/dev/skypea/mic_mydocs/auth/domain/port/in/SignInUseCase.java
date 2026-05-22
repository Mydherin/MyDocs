package dev.skypea.mic_mydocs.auth.domain.port.in;

import dev.skypea.mic_mydocs.auth.domain.model.User;

public interface SignInUseCase {

    record Result(User user, boolean isNew) {}

    Result signIn(String googleAccessToken);
}
