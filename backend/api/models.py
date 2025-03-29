from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()

# ------------------------------
# Modelo: Users
# ------------------------------
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    address = db.Column(db.String)
    birthday = db.Column(db.Date)
    phone = db.Column(db.String)
    role = db.Column(db.String)
    goals = db.Column(db.String)
    diet_prefs = db.Column(db.String)
    allergies = db.Column(db.String)
    discount = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(datetime.timezone.utc))
    
    # Relaciones
    diets = db.relationship('Diet', backref='client', lazy=True)
    routines = db.relationship('Routine', backref='client', lazy=True)
    progress_records = db.relationship('ProgressRecord', backref='client', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True)
    received_messages = db.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver', lazy=True)


# ------------------------------
# Modelo: Foods
# ------------------------------
class Food(db.Model):
    __tablename__ = 'foods'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    kcal_100g = db.Column(db.Integer)
    allergens = db.Column(db.String)
    vegetarian = db.Column(db.Boolean, default=False)
    vegan = db.Column(db.Boolean, default=False)
    
    # Relacion: Un alimento puede estar en varios meals
    meals = db.relationship('Meal', backref='food_obj', lazy=True)


# ------------------------------
# Modelo: Meals
# ------------------------------
class Meal(db.Model):
    __tablename__ = 'meals'
    
    id = db.Column(db.Integer, primary_key=True)
    food = db.Column(db.Integer, db.ForeignKey('foods.id'), nullable=False)
    weight = db.Column(db.Integer)
    kcal = db.Column(db.Integer)


# ------------------------------
# Modelo: Diets
# ------------------------------
class Diet(db.Model):
    __tablename__ = 'diets'
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.String)
    goals = db.Column(db.String)
    meals_id = db.Column(db.Integer, db.ForeignKey('meals.id'))
    created_at = db.Column(db.Date, default=date.today)
    update = db.Column(db.Date, onupdate=date.today)
    
    # Relacion: Cada dieta puede tener un meal asociado
    meal = db.relationship('Meal', backref='diet', lazy=True)


# ------------------------------
# Modelo: Routines
# ------------------------------
class Routine(db.Model):
    __tablename__ = 'routines'
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.String)
    progress_id = db.Column(db.Integer, db.ForeignKey('progress_records.id'))
    created_at = db.Column(db.Date, default=date.today)
    update = db.Column(db.Date, onupdate=date.today)
    
    # Relacion: Una rutina puede estar asociada a un registro de progreso
    progress_record = db.relationship('ProgressRecord', backref='routine', lazy=True)


# ------------------------------
# Modelo: Progress_records
# ------------------------------
class ProgressRecord(db.Model):
    __tablename__ = 'progress_records'
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    routine_id = db.Column(db.Integer, db.ForeignKey('routines.id'), nullable=False)
    comments = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ------------------------------
# Modelo: Products
# ------------------------------
class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)  # Se usa string, aunque en el esquema original se indicaba integer.
    description = db.Column(db.String)  # Se usa string en lugar de integer.
    flavour = db.Column(db.String)
    weight = db.Column(db.Integer)
    stock = db.Column(db.Integer)
    price = db.Column(db.Integer)
    category = db.Column(db.String)
    ordered = db.Column(db.Date)
    expiration = db.Column(db.Date)


# ------------------------------
# Modelo: Notifications
# ------------------------------
class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String)
    reminder = db.Column(db.DateTime)
    estate = db.Column(db.String)
    
    # Relacion: Una notificación puede estar asociada a varios mensajes
    messages = db.relationship('Message', backref='notification', lazy=True)


# ------------------------------
# Modelo: Messages
# ------------------------------
class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String)
    date = db.Column(db.DateTime, default=datetime.timezone.utc)
    read = db.Column(db.Boolean, default=False)
    notificacion = db.Column(db.Integer, db.ForeignKey('notifications.id'))