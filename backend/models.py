# backend/models.py
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash # Importa estas funciones

db = SQLAlchemy()

# --- Nuevo modelo de Usuario (User) ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False) # 'male' o 'female'
    email = db.Column(db.String(120), unique=True, nullable=False, index=True) # Email será el login y debe ser único
    password_hash = db.Column(db.String(256), nullable=False) # Para la contraseña hasheada
    phone = db.Column(db.String(20)) # Puede ser nullable
    address = db.Column(db.String(255), nullable=False) # Ahora es obligatorio
    level = db.Column(db.String(50), nullable=False) # principiante, intermedio, avanzado
    allergies = db.Column(db.Text) # Puede ser un campo de texto largo
    diet_preferences = db.Column(db.Text) # Puede ser un campo de texto largo

    def __repr__(self):
        return f'<User {self.email}>'

    def set_password(self, password):
        # Hashea la contraseña y la guarda
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        # Verifica si la contraseña proporcionada coincide con el hash
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        # Método para serializar el objeto User a un diccionario (sin la contraseña)
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "gender": self.gender,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "level": self.level,
            "allergies": self.allergies,
            "diet_preferences": self.diet_preferences
        }