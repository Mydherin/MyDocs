package dev.skypea.mic_mydocs.workspace.application;

public class WorkspaceAccessDeniedException extends RuntimeException {
    public WorkspaceAccessDeniedException() {
        super("Access denied");
    }
}
