package dev.skypea.mic_mydocs.auth.infrastructure.web;

import dev.skypea.mic_mydocs.auth.application.InvalidTokenException;
import dev.skypea.mic_mydocs.auth.domain.port.in.SignInUseCase;
import dev.skypea.mic_mydocs.auth.infrastructure.web.dto.ErrorResponse;
import dev.skypea.mic_mydocs.auth.infrastructure.web.dto.SignInResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final SignInUseCase signInUseCase;

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("missing_token"));
        }

        var token = authHeader.substring(7);

        try {
            var result = signInUseCase.signIn(token);
            var user = result.user();
            var body = new SignInResponse(user.getId(), user.getEmail(), user.getNickname(), user.getPicture());
            return result.isNew()
                    ? ResponseEntity.status(HttpStatus.CREATED).body(body)
                    : ResponseEntity.ok(body);
        } catch (InvalidTokenException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("invalid_token"));
        }
    }
}
