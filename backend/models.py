# backend/models.py
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash # Importa estas funciones
from datetime import datetime, date

db = SQLAlchemy()

class Project(db.Model): # <<< Project Class must be defined correctly <<<
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }

# --- Nuevo modelo de Usuario (User) ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False) # 'male' o 'female'
    email = db.Column(db.String(120), unique=True, nullable=False, index=True) # Email será el login y debe ser único
    password_hash = db.Column(db.String(256), nullable=False) # Para la contraseña hasheada
    phone = db.Column(db.String(20), nullable=True) # Teléfono opcional
    address = db.Column(db.String(255), nullable=False) # Ahora es obligatorio
    level = db.Column(db.String(50), nullable=False) # principiante, intermedio, avanzado
    allergies = db.Column(db.Text, nullable=True) # Puede ser un campo de texto largo
    diet_preferences = db.Column(db.Text, nullable=True) # Puede ser un campo de texto largo

    # Relación con ProgressTracking
    progress_records = db.relationship('ProgressTracking', backref='user', lazy=True, cascade="all, delete-orphan")
    # Relación con TrainingDay
    training_days = db.relationship('TrainingDay', backref='user', lazy=True, cascade="all, delete-orphan")

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
            "firstName": self.first_name,
            "lastName": self.last_name,
            "gender": self.gender,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "level": self.level,
            "allergies": self.allergies,
            "dietPreferences": self.diet_preferences
        }
    
    # --- Nuevo modelo para el seguimiento de progreso ---
class ProgressTracking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    record_date = db.Column(db.DateTime, nullable=False, default=datetime.today) # Fecha del registro

    # Métricas de peso y medidas
    weight_kg = db.Column(db.Float, nullable=True) # Peso en kilogramos
    biceps_cm = db.Column(db.Float, nullable=True) # Medida del bíceps en cm
    chest_cm = db.Column(db.Float, nullable=True)  # Medida del pecho en cm
    waist_cm = db.Column(db.Float, nullable=True)  # Medida de la cintura en cm
    hips_cm = db.Column(db.Float, nullable=True)   # Medida de las caderas en cm
    thigh_cm = db.Column(db.Float, nullable=True)  # Medida del muslo en cm
    glutes_cm = db.Column(db.Float, nullable=True) # Medida de los glúteos en cm

    def to_dict(self): # Añadido o corregido to_dict()
        return {
            'id': self.id,
            'userId': self.user_id,
            'recordDate': self.record_date.isoformat(),
            'weightKg': self.weight_kg,
            'bicepsCm': self.biceps_cm,
            'chestCm': self.chest_cm,
            'waistCm': self.waist_cm,
            'hipsCm': self.hips_cm,
            'thighCm': self.thigh_cm,
            'glutesCm': self.glutes_cm
        }

    def __repr__(self):
        return f'<Progress {self.user.email} - {self.record_date.strftime("%Y-%m-%d")}>'

# --- Nuevo modelo para los días de entrenamiento ---
class TrainingDay(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    training_date = db.Column(db.Date, nullable=False, default=date.today()) # Solo la fecha, sin hora

    description = db.Column(db.String(255), nullable=True)

    def to_dict(self): # Añadido o corregido to_dict()
        return {
            'id': self.id,
            'userId': self.user_id,
            'trainingDate': self.training_date.isoformat(),
            'description': self.description
        }

    def __repr__(self):
        return f'<TrainingDay {self.user.email} - {self.training_date.strftime("%Y-%m-%d")}>'

    # Asegurarse de que no haya entradas duplicadas para el mismo usuario y fecha
__table_args__ = (db.UniqueConstraint('user_id', 'training_date', name='_user_training_day_uc'),)
