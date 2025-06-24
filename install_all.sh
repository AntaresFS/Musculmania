#!/bin/bash
echo "Iniciando instalación de todas las dependencias..."

echo ""
echo "Instalando dependencias del backend (Python)..."
pip install -r backend/requirements.txt
if [ $? -eq 0 ]; then
    echo "Dependencias del backend instaladas correctamente."
else
    echo "¡Error al instalar las dependencias del backend!"
    exit 1
fi

echo ""
echo "Instalando dependencias del frontend (Node.js)..."
cd frontend && npm install
if [ $? -eq 0 ]; then
    echo "Dependencias del frontend instaladas correctamente."
else
    echo "¡Error al instalar las dependencias del frontend!"
    exit 1
fi

echo ""
echo "¡Proceso de instalación de dependencias completado!"