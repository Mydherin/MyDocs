package dev.skypea.mic_mydocs.auth.application;

import dev.skypea.mic_mydocs.auth.domain.port.in.SignInUseCase;
import dev.skypea.mic_mydocs.auth.domain.port.out.GoogleTokenValidator;
import dev.skypea.mic_mydocs.auth.domain.port.out.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SignInService implements SignInUseCase {

    private final GoogleTokenValidator googleTokenValidator;
    private final UserRepository userRepository;

    @Override
    public Result signIn(String googleAccessToken) {
        var googleUser = googleTokenValidator.validate(googleAccessToken)
                .orElseThrow(() -> new InvalidTokenException("invalid_token"));

        return userRepository.findByEmail(googleUser.getEmail())
                .map(existing -> new Result(existing, false))
                .orElseGet(() -> new Result(userRepository.save(googleUser), true));
    }
}
