package dev.skypea.mic_mydocs.auth.application;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException(String message) {
        super(message);
    }
}
