# Musculmania
CRM Musculmanía con React, Python (Flask) y SQLAlchemy

# Monorepo: Frontend React + Backend Flask + PostgreSQL

Este repositorio contiene:

- **frontend/**: aplicación React (Create React App)
- **backend/**: servidor Flask en Python
- **.devcontainer/**: configuración de Dev Container (Docker Compose) para VSCode y GitHub Codespaces

## Requisitos previos

> Si trabajas en VSCode localmente, necesitas tener instalado Docker Desktop (o Docker Engine) y la extensión “Remote - Containers”.

## 1. Levantar el Dev Container (VSCode)

1. Abre esta carpeta (`Musculmania/`) en VSCode.
2. Si no tienes el contenedor abierto aún, haz clic en el icono verde (esquina inferior izquierda) → “Remote-Containers: Reopen in Container”.
3. VSCode construirá la imagen (Docker Compose) y luego instalará dependencias según `postCreateCommand`.

> Una vez terminado, verás el prompt dentro del contenedor y podrás ejecutar comandos de Python, pip, npm, etc.

## 2. Ejecutar todo con Docker Compose

Si ya estás dentro del Dev Container (o fuera con Docker instalado), en la raíz ejecuta:

```bash
docker-compose -f .devcontainer/docker-compose.yml up --build
