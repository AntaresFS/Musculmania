# .devcontainer/Dockerfile
# Usamos una imagen base de Microsoft que ya viene preparada para Dev Containers
FROM mcr.microsoft.com/devcontainers/python:1-3.11-bookworm

# 1. Eliminamos Yarn repo porque Microsoft no actualiza la llave GPG y bloquea apt-get update
RUN rm -f /etc/apt/sources.list.d/yarn.list \
    && apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends curl ca-certificates gnupg

# 2. Instalamos Node.js 20 usando el método oficial más reciente
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install nodejs -y

# 3. Instalamos el cliente de PostgreSQL y limpiamos
RUN apt-get install -y --no-install-recommends postgresql-client \
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace