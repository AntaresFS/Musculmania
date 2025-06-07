import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv

# Cargar variables de entorno desde un archivo .env
load_dotenv(override=True)

app = Flask(__name__)
CORS(app)  # si vas a consumir desde otro dominio (React en otro puerto)

print("DATABASE_URL:", os.getenv("DATABASE_URL"))

# Configuración de SQLAlchemy usando la variable de entorno DATABASE_URL
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:example@db:5432/mydb"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicializar la base de datos y migraciones
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Ejemplo de modelo
class Item(db.Model):
    __tablename__ = "items"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    def to_dict(self):
        return {"id": self.id, "name":self.name}
    
# Rutas de ejemplo
@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello desde Flask + SQLAlchemy!"}), 200

@app.route("/api/items", methods=["GET"])
def get_items():
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items]), 200

@app.route("/api/items", methods=["POST"])
def create_item():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "El nombre es requerido"}), 400
    
    new_item = Item(name=name)
    db.session.add(new_item)
    db.session.commit() 
    return jsonify(new_item.to_dict()), 201

if __name__ == "__main__":
    # Solo para desarrollo local (no se usa en producción)
    app.run(host="0.0.0.0", port=5000, debug=True)  # Cambia el puerto si es necesario
    # En producción, usa un servidor WSGI como Gunicorn o uWSGI
    # y configura el servidor web (Nginx, Apache, etc.) para servir la aplicación.
    # Por ejemplo: gunicorn -w 4 -b

    