# backend/app.py
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, Project

load_dotenv() # Carga las variables de entorno desde .env

app = Flask(__name__)
CORS(app) # Habilita CORS para todas las rutas

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# --- Creación de tablas y datos de prueba ---
# En una app real, usarías Flask-Migrate
with app.app_context():
    db.create_all()
    # Añade un proyecto de ejemplo si no existe
    if not Project.query.first():
        sample_project = Project(name="Mi Primer Proyecto", description="Este es un proyecto de prueba desde el backend.")
        db.session.add(sample_project)
        db.session.commit()

# --- Rutas de la API ---
@app.route('/')
def index():
    return "Backend funcionando!"

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([project.to_dict() for project in projects])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)