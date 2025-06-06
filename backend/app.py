from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import psycopg2

app = Flask(__name__)
CORS(app)  # si vas a consumir desde otro dominio (React en otro puerto)

# Configuración de la conexión a PostgreSQL
POSTGRES_USER = os.environ.get("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "example")
POSTGRES_DB = os.environ.get("POSTGRES_DB", "mydb")
POSTGRES_HOST = os.environ.get("POSTGRES_HOST", "db")   # 'db' será el nombre del servicio en Docker Compose
POSTGRES_PORT = os.environ.get("POSTGRES_PORT", "5432")

def get_db_connection():
    conn = psycopg2.connect(
        host=POSTGRES_HOST,
        database=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        port=POSTGRES_PORT
    )
    return conn

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "¡Hola desde Flask!"}), 200

@app.route("/api/items", methods=["GET"])
def get_items():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name FROM items;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    items = [{"id": r[0], "name": r[1]} for r in rows]
    return jsonify(items)

@app.route("/api/items", methods=["POST"])
def create_item():
    data = request.get_json()
    name = data.get("name", "")
    if not name:
        return jsonify({"error": "Falta 'name'"}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO items (name) VALUES (%s) RETURNING id;", (name,))
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"id": new_id, "name": name}), 201

if __name__ == "__main__":
    # En producción normalmente usarás gunicorn u otro WSGI, pero para desarrollo:
    app.run(host="0.0.0.0", port=5000, debug=True)
