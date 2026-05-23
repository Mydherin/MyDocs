package dev.skypea.mic_mydocs.workspace.application;

public class LastWorkspaceException extends RuntimeException {
    public LastWorkspaceException() {
        super("Cannot delete the last owned workspace");
    }
}
