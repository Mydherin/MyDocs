package dev.skypea.mic_mydocs.auth.infrastructure.web;

import dev.skypea.mic_mydocs.auth.domain.port.out.GoogleTokenValidator;
import dev.skypea.mic_mydocs.auth.domain.port.out.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class GoogleAuthFilter extends OncePerRequestFilter {

    private final GoogleTokenValidator googleTokenValidator;
    private final UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getServletPath().equals("/auth/signin");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws IOException, ServletException {
        var authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, "{\"error\":\"missing_token\"}");
            return;
        }

        var token = authHeader.substring(7);
        var googleUser = googleTokenValidator.validate(token);

        if (googleUser.isEmpty()) {
            sendError(response, "{\"error\":\"invalid_token\"}");
            return;
        }

        var dbUser = userRepository.findByEmail(googleUser.get().getEmail());

        if (dbUser.isEmpty()) {
            sendError(response, "{\"error\":\"user_not_found\"}");
            return;
        }

        request.setAttribute("authenticatedUser", dbUser.get());
        filterChain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response, String body) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(body);
    }
}
