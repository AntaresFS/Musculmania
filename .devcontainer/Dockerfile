FROM mcr.microsoft.com/devcontainers/python:3.9

# Instalar Node.js (si no lo trae ya) usando el script de instalación de Node
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

WORKDIR /workspace

# Instalar dependencias del backend
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --upgrade pip && pip install -r backend/requirements.txt

# Instalar dependencias del frontend
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm install

# Volver a la raíz para dejar el contenedor listo
WORKDIR /workspace

EXPOSE 3001