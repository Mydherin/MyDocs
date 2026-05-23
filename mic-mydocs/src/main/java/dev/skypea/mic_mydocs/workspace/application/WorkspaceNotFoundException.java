package dev.skypea.mic_mydocs.workspace.application;

public class WorkspaceNotFoundException extends RuntimeException {
    public WorkspaceNotFoundException(String id) {
        super("Workspace not found: " + id);
    }
}
