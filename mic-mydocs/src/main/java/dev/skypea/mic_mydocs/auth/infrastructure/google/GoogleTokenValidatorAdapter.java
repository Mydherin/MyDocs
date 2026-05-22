package dev.skypea.mic_mydocs.auth.infrastructure.google;

import dev.skypea.mic_mydocs.auth.domain.model.User;
import dev.skypea.mic_mydocs.auth.domain.port.out.GoogleTokenValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleTokenValidatorAdapter implements GoogleTokenValidator {

    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final RestClient restClient;

    @Override
    public Optional<User> validate(String accessToken) {
        try {
            var info = restClient.get()
                    .uri(USERINFO_URL)
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(GoogleTokenInfoResponse.class);

            if (info == null || info.getSub() == null) return Optional.empty();

            var nickname = Optional.ofNullable(info.getGivenName())
                    .filter(n -> !n.isBlank())
                    .or(() -> Optional.ofNullable(info.getName()).filter(n -> !n.isBlank()))
                    .orElse(info.getEmail().split("@")[0]);

            return Optional.of(User.builder()
                    .id(info.getSub())
                    .email(info.getEmail())
                    .nickname(nickname)
                    .picture(info.getPicture())
                    .build());

        } catch (Exception e) {
            log.warn("Google token validation failed: {}", e.getMessage());
            return Optional.empty();
        }
    }
}
