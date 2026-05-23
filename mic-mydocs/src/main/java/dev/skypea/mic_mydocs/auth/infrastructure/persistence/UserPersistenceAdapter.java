package dev.skypea.mic_mydocs.auth.infrastructure.persistence;

import dev.skypea.mic_mydocs.auth.domain.model.User;
import dev.skypea.mic_mydocs.auth.domain.port.out.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserPersistenceAdapter implements UserRepository {

    private final UserJpaRepository jpaRepository;

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public User save(User user) {
        return toDomain(jpaRepository.save(toEntity(user)));
    }

    @Override
    public List<User> findAllByIds(List<String> ids) {
        return jpaRepository.findAllById(ids).stream().map(this::toDomain).toList();
    }

    private User toDomain(UserJpaEntity e) {
        return User.builder()
                .id(e.getId())
                .email(e.getEmail())
                .nickname(e.getNickname())
                .picture(e.getPicture())
                .build();
    }

    private UserJpaEntity toEntity(User u) {
        return UserJpaEntity.builder()
                .id(u.getId())
                .email(u.getEmail())
                .nickname(u.getNickname())
                .picture(u.getPicture())
                .build();
    }
}
