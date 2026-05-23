# Dev Deploy

All scripts live in `harness/techguide/dev-deploy/scripts/`. Run from any directory — paths are resolved automatically.

## Logs

| Service      | Log file                    |
|--------------|-----------------------------|
| Spring Boot  | `/tmp/mydocs-backend.log`   |
| SPA          | `/tmp/mydocs-spa.log`       |

## Commands

| Action           | Script              | Effect                                                    |
|------------------|---------------------|-----------------------------------------------------------|
| Start            | `start.sh`          | Postgres (Docker) + Spring Boot + SPA                     |
| Stop             | `stop.sh`           | Kills processes, stops container (data preserved)         |
| Stop + clean     | `stop-clean.sh`     | Same as stop + removes Postgres volume (data wiped)       |
| Restart          | `restart.sh`        | stop → start                                              |
| Restart + clean  | `restart-clean.sh`  | stop-clean → start (fresh DB)                             |
| Status           | `status.sh`         | Shows running state and URLs for each service             |

## URLs

- Backend: `http://localhost:8080`
- SPA: `http://localhost:5175`

## When to use clean variants

Use `stop-clean` / `restart-clean` when you need a fresh database — e.g. after Liquibase migration changes or to reproduce a clean-state scenario.

## How stop works

`stop.sh` and `stop-clean.sh` kill services in two steps:
1. Kill by PID file (`/tmp/mydocs-*.pid`) if present.
2. Kill any remaining process still listening on the service port (5175 for SPA, 8080 for Spring Boot).

This ensures stale PID files (e.g. from a previous session) never leave orphan processes behind.

## Verifying startup

After running `start.sh` or `restart*.sh`, always confirm all three services are fully up before considering the task done:

1. `start.sh` polls Spring Boot and the SPA and prints `READY` or `TIMEOUT` for each — watch for `TIMEOUT` lines.
2. If a service shows `TIMEOUT`, inspect the corresponding log file (see Logs table above) to diagnose the failure.
3. You can also run `status.sh` at any point to check running state.
