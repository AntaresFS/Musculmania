FROM python:3.11-slim

# Definir variables de entorno para que Python no genere archivos .pyc y ejecute en modo sin buffers
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copiamos requirements primero para aprovechar el cache de Docker
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos la aplicación
COPY . /app

# Exponer el puerto donde correrá Flask
EXPOSE 5000

CMD ["python", "app.py"]
