package dev.skypea.mic_mydocs.auth.domain.port.out;

import dev.skypea.mic_mydocs.auth.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    User save(User user);
    List<User> findAllByIds(List<String> ids);
}
