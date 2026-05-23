package dev.skypea.mic_mydocs.workspace.application;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String email) {
        super("User not found: " + email);
    }
}
