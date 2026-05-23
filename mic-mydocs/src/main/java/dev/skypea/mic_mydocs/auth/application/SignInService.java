package dev.skypea.mic_mydocs.auth.application;

import dev.skypea.mic_mydocs.auth.domain.port.in.SignInUseCase;
import dev.skypea.mic_mydocs.auth.domain.port.out.GoogleTokenValidator;
import dev.skypea.mic_mydocs.auth.domain.port.out.UserRepository;
import dev.skypea.mic_mydocs.workspace.domain.port.in.CreateWorkspaceUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SignInService implements SignInUseCase {

    private final GoogleTokenValidator googleTokenValidator;
    private final UserRepository userRepository;
    private final CreateWorkspaceUseCase createWorkspaceUseCase;

    @Override
    public Result signIn(String googleAccessToken) {
        var googleUser = googleTokenValidator.validate(googleAccessToken)
                .orElseThrow(() -> new InvalidTokenException("invalid_token"));

        return userRepository.findByEmail(googleUser.getEmail())
                .map(existing -> new Result(existing, false))
                .orElseGet(() -> {
                    var newUser = userRepository.save(googleUser);
                    createWorkspaceUseCase.create(newUser.getId(), "My Workspace");
                    return new Result(newUser, true);
                });
    }
}
