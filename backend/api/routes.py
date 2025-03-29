from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app.models import db, User, Food, Meal, Diet, Routine, ProgressRecord, Notification, Message
from datetime import timedelta

# Crear blueprint
api = Blueprint('api', __name__)


# ------------------------------
# Endpoint de registro de usuario
# ------------------------------
@api.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    address = data.get('address')
    birthday = data.get('birthday')
    phone = data.get('phone')
    role = data.get('role', 'client') # El rol por defecto es 'client'
    goals = data.get('goals')
    diet_prefs = data.get('diet_prefs')
    allergies = data.get('allergies')
    discount = data.get('discount', '0') # Descuento por defecto es 0

    # Validar que todos los campos requeridos estén presentes
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'El usuario ya existe'}), 409
    
    new_user = User(
        email=email,
        password_hash=generate_password_hash(password),
        first_name=first_name,
        last_name=last_name,
        address=address,
        birthday=birthday,
        phone=phone,
        role=role,
        goals=goals,
        diet_prefs=diet_prefs,
        allergies=allergies,
        discount=discount 
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

# ------------------------------
# Endpoint de registro de login
# ------------------------------
@api.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Credenciales inválidas'}), 401
    
    access_token = create_access_token(identity={'email': user.email}, expires_delta=timedelta(days=1))
    return jsonify({'access_token': access_token}), 200

# ------------------------------
# Endpoint para obtener datos del usuario (protegido)
# ------------------------------
@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(email=current_user_id)
    
    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404
    
    user_data = {
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'address': user.address,
        'birthday': user.birthday,
        'phone': user.phone,
        'role': user.role,
        'goals': user.goals,
        'diet_prefs': user.diet_prefs,
        'allergies': user.allergies,
    }
    
    return jsonify({'user': user_data}), 200

# ------------------------------
# Endpoint para actualizar datos del usuario (protegido)
# ------------------------------
@api.route('/profile', methods=['PATCH'])
@jwt_required()
def modify_user():
    data = request.get_json()
    email = data.get('email')  
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    address = data.get('address')
    birthday = data.get('birthday')
    phone = data.get('phone')
    role = data.get('role', 'client') # El rol por defecto es 'client'
    goals = data.get('goals')
    diet_prefs = data.get('diet_prefs')
    allergies = data.get('allergies')
    discount = data.get('discount', '0') # Descuento por defecto es 0
    # Para contrasea se creará un endpoint diferente

    new_user_data = User(
        email=email,
        password_hash=generate_password_hash(password),
        first_name=first_name,
        last_name=last_name,
        address=address,
        birthday=birthday,
        phone=phone,
        role=role,
        goals=goals,
        diet_prefs=diet_prefs,
        allergies=allergies,
        discount=discount 
    )

    db.session.add(new_user_data)
    db.session.commit()
    return jsonify({'message': 'Datos modificados exitosamente'}), 201