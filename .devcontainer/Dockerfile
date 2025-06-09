# .devcontainer/Dockerfile
# Usamos una imagen base de Microsoft que ya viene preparada para Dev Containers
FROM mcr.microsoft.com/devcontainers/python:1-3.11-bullseye

# Instala Node.js (necesario para React/Vite) y el cliente de PostgreSQL
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends curl

# Añadimos el repositorio oficial de NodeSource para Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Instalamos Node.js (v20), npm y el cliente de PostgreSQL
RUN apt-get -y install --no-install-recommends nodejs postgresql-client

# Copia los requisitos del backend para poder instalarlos después
COPY backend/requirements.txt /tmp/requirements.txt

# Limpia la caché de apt
RUN apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo
WORKDIR /workspace