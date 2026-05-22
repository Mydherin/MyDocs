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
