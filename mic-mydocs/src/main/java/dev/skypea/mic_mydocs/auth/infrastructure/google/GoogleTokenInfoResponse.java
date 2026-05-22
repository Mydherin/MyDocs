package dev.skypea.mic_mydocs.auth.infrastructure.google;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
class GoogleTokenInfoResponse {
    private String sub;
    private String email;
    private String name;
    private String picture;

    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("email_verified")
    private String emailVerified;
}
