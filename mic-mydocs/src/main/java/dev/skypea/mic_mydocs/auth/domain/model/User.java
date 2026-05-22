package dev.skypea.mic_mydocs.auth.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class User {
    String id;
    String email;
    String nickname;
    String picture;
}
