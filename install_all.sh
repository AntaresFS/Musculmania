#!/bin/bash
# Asegurar que estamos en el directorio del script (raíz del proyecto)
cd "$(dirname "$0")"

echo "-------------------------------------------------------"
echo "🚀 Iniciando configuración del entorno Musculmania"
echo "-------------------------------------------------------"

# 1. Instalación del Backend (Python)
echo "🐍 Configurando Backend..."
if [ -f "backend/requirements.txt" ]; then
    pip install --no-cache-dir -r backend/requirements.txt
    if [ $? -eq 0 ]; then
        echo "✅ Dependencias de Python instaladas."
    else
        echo "❌ Error al instalar dependencias de Python."
        exit 1
    fi
else
    echo "⚠️  No se encontró backend/requirements.txt, saltando paso."
fi

echo ""

# 2. Instalación del Frontend (Node.js)
echo "📦 Configurando Frontend..."
if [ -d "frontend" ]; then
    # Usamos subshell ( ) para entrar y salir de la carpeta limpiamente
    (
        cd frontend
        if [ -f "package.json" ]; then
            npm install
            if [ $? -eq 0 ]; then
                echo "✅ Dependencias de Node.js instaladas."
            else
                echo "❌ Error en npm install."
                exit 1
            fi
        else
            echo "⚠️  No se encontró package.json en /frontend."
        fi
    )
else
    echo "⚠️  No se encontró la carpeta /frontend, saltando paso."
fi

echo ""
echo "-------------------------------------------------------"
echo "✨ ¡Todo listo! El entorno está preparado."
echo "-------------------------------------------------------"