# backend/app.py
import os
from flask import Flask, jsonify, request # Importa 'request' para acceder a los datos de la petición
from flask_cors import CORS
from dotenv import load_dotenv
from .models import db, Project, User, ProgressTracking, TrainingDay # Importa el modelo User
from sqlalchemy.exc import IntegrityError # Importa IntegrityError para manejar errores de BD
from flask_migrate import Migrate # Importa Flask-Migrate 
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity
from datetime import datetime

load_dotenv() # Carga las variables de entorno desde .env

app = Flask(__name__)
CORS(app) # Habilita CORS para todas las rutas

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_super_secret_key') # Usa una clave secreta para la sesión y CSRF

# Configuración de JWT
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt-key') # ¡CAMBIA ESTO EN PRODUCCIÓN!
jwt = JWTManager(app) # <-- Inicializa JWTManager

db.init_app(app)

migrate = Migrate(app, db) # Inicializa Flask-Migrate para manejar migraciones de base de datos

# Este decorador le dice a Flask-JWT-Extended cómo encontrar un usuario
# dado el 'identity' que se guardó en el token (en este caso, el 'id' del usuario)
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"] # 'sub' es la clave por defecto para la identidad
    # Si guardas solo el ID del usuario en el token:
    user_id = identity.get('id') if isinstance(identity, dict) and 'id' in identity else identity
    return User.query.get(user_id) # Busca el usuario por su ID


# --- Rutas de la API ---
@app.route('/')
def index():
    return "Backend funcionando!"

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([project.to_dict() for project in projects])


### **Endpoint de Registro de Usuario**
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()

    # Validar que los datos requeridos estén presentes y no sean vacíos
    required_fields = ['firstName', 'lastName', 'gender', 'email', 'address', 'level', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            # Devuelve un 400 Bad Request si falta algún campo obligatorio
            return jsonify({'message': f'Falta el campo obligatorio o está vacío: {field}'}), 400
            
    email = data['email'] # Accede directamente, ya validado que existe

    # Comprobar si el email ya existe en la base de datos
    if User.query.filter_by(email=email).first():
        # Devuelve un 409 Conflict si el email ya está registrado
        return jsonify({'message': 'El correo electrónico ya está registrado.'}), 409

    try:
        # Crear una nueva instancia de User con los datos recibidos
        new_user = User(
            first_name=data['firstName'],
            last_name=data['lastName'],
            gender=data['gender'],
            email=email,
            phone=data.get('phone'), # Usar .get() para campos opcionales
            address=data['address'],
            level=data['level'],
            allergies=data.get('allergies'),
            diet_preferences=data.get('dietPrefs')
        )

        # Hashear y establecer la contraseña
        new_user.set_password(data['password'])

        db.session.add(new_user) # Añadir el nuevo usuario a la sesión de la BD
        db.session.commit()     # Confirmar los cambios en la BD

        # Devuelve una respuesta exitosa con el usuario creado (sin la contraseña)
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'user': new_user.to_dict() # Utiliza el método to_dict del modelo
        }), 201 # 201 Created

    except IntegrityError:
        # Esto captura errores de unicidad que no fueron previstos por la comprobación inicial
        db.session.rollback() # Deshacer la transacción si hay un error
        return jsonify({'message': 'Error de base de datos: El correo electrónico ya existe.'}), 409
    except Exception as e:
        # Captura cualquier otro error inesperado del servidor
        db.session.rollback()
        return jsonify({'message': f'Error interno del servidor: {str(e)}'}), 500


### **Endpoint de Login de Usuario**
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    # Validar que se hayan proporcionado email y contraseña
    if not email or not password:
        return jsonify({'message': 'Se requiere correo electrónico y contraseña.'}), 400

    # Buscar al usuario por email
    user = User.query.filter_by(email=email).first()

    # Si el usuario no existe o la contraseña es incorrecta
    if user is None or not user.check_password(password):
        # Devuelve un 401 Unauthorized para credenciales inválidas
        return jsonify({'message': 'Correo electrónico o contraseña incorrectos.'}), 401

    # Si las credenciales son correctas
    # Crear un token de acceso para el usuario autenticado
    access_token = create_access_token(identity={'id': user.id})
    
    # Devuelve el token y los datos del usuario (sin la contraseña)
    return jsonify({
        'message': 'Inicio de sesión exitoso',
        'access_token': access_token, # Enviamos el token JWT al frontend
        'user': user.to_dict() # Devuelve los datos del usuario (sin la contraseña)
    }), 200 # 200 OK

# --- Ejemplo de ruta protegida ---
@app.route('/api/protected', methods=['GET'])
@jwt_required() # <-- Decorador que protege la ruta
def protected_route():
    # Accede a la identidad del usuario actual con get_jwt_identity
    current_user = get_jwt_identity() # Esto ahora devolverá el objeto User si user_lookup_loader funciona

    if current_user:
        return jsonify(logged_in_as=current_user.email, message="¡Acceso concedido a ruta protegida!"), 200
    return jsonify(message="Usuario no encontrado."), 404

### **Endpoint para Registrar Progreso de Cliente**
@app.route('/api/progress', methods=['POST'])
@jwt_required()
def add_progress_record():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity.get('id') if isinstance(current_user_identity, dict) else current_user_identity
    
    if not user_id:
        return jsonify({'message': 'No se pudo obtener la identidad del usuario del token.'}), 401

    data = request.get_json()

    # Validar campos requeridos (al menos la fecha)
    if 'recordDate' not in data or not data['recordDate']:
        return jsonify({'message': 'La fecha de registro es obligatoria.'}), 400

    try:
        # Parsear la fecha del string ISO (ej. "2023-10-26T10:00:00.000Z" o "2023-10-26")
        # Intentar con formato datetime, luego con formato date
        try:
            record_date = datetime.fromisoformat(data['recordDate'].replace('Z', '+00:00'))
        except ValueError:
            record_date = datetime.strptime(data['recordDate'], '%Y-%m-%d')
            
        new_record = ProgressTracking(
            user_id=user_id,
            record_date=record_date,
            weight_kg=data.get('weightKg'),
            biceps_cm=data.get('bicepsCm'),
            chest_cm=data.get('chestCm'),
            waist_cm=data.get('waistCm'),
            hips_cm=data.get('hipsCm'),
            thigh_cm=data.get('thighCm'),
            glutes_cm=data.get('glutesCm')
        )
        db.session.add(new_record)
        db.session.commit()
        return jsonify({
            'message': 'Registro de progreso añadido exitosamente',
            'record': new_record.to_dict()
        }), 201
    except ValueError:
        db.session.rollback()
        return jsonify({'message': 'Formato de fecha inválido. Usa YYYY-MM-DD o ISO 8601.'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al añadir registro de progreso: {str(e)}'}), 500

### **Endpoint para Obtener Registros de Progreso de un Cliente**
@app.route('/api/progress/<int:user_id>', methods=['GET'])
@jwt_required()
def get_progress_records(user_id):
    current_user_identity = get_jwt_identity()
    auth_user_id = current_user_identity.get('id') if isinstance(current_user_identity, dict) else current_user_identity

    # Autorización: Solo el propio usuario puede ver sus registros (o un admin si lo implementas)
    if auth_user_id != user_id:
        return jsonify({'message': 'Acceso denegado. No tienes permiso para ver estos registros.'}), 403

    progress_records = ProgressTracking.query.filter_by(user_id=user_id).order_by(ProgressTracking.record_date).all()
    if not progress_records:
        return jsonify([]), 200
    
    return jsonify([record.to_dict() for record in progress_records]), 200

### **Endpoint para Registrar un Día de Entrenamiento**
@app.route('/api/training-day', methods=['POST'])
@jwt_required()
def add_training_day():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity.get('id') if isinstance(current_user_identity, dict) else current_user_identity

    if not user_id:
        return jsonify({'message': 'No se pudo obtener la identidad del usuario del token.'}), 401

    data = request.get_json()

    if 'trainingDate' not in data or not data['trainingDate']:
        return jsonify({'message': 'La fecha de entrenamiento es obligatoria.'}), 400

    try:
        # Parsear la fecha (esperamos YYYY-MM-DD)
        training_date = datetime.strptime(data['trainingDate'], '%Y-%m-%d').date()

        # Verificar si ya existe un registro para este usuario en esta fecha
        existing_day = TrainingDay.query.filter_by(user_id=user_id, training_date=training_date).first()
        if existing_day:
            return jsonify({'message': 'Ya existe un registro de entrenamiento para este día.'}), 409

        new_training_day = TrainingDay(
            user_id=user_id,
            training_date=training_date,
            description=data.get('description')
        )
        db.session.add(new_training_day)
        db.session.commit()
        return jsonify({
            'message': 'Día de entrenamiento registrado exitosamente',
            'trainingDay': new_training_day.to_dict()
        }), 201
    except ValueError:
        db.session.rollback()
        return jsonify({'message': 'Formato de fecha inválido para trainingDate. Usa YYYY-MM-DD.'}), 400
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Error de base de datos: Ya existe un registro de entrenamiento para esta fecha.'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al registrar día de entrenamiento: {str(e)}'}), 500

### **Endpoint para Obtener Días de Entrenamiento de un Cliente**
@app.route('/api/training-days/<int:user_id>', methods=['GET'])
@jwt_required()
def get_training_days(user_id):
    current_user_identity = get_jwt_identity()
    auth_user_id = current_user_identity.get('id') if isinstance(current_user_identity, dict) else current_user_identity

    # Autorización: Solo el propio usuario puede ver sus registros
    if auth_user_id != user_id:
        return jsonify({'message': 'Acceso denegado. No tienes permiso para ver estos registros.'}), 403

    training_days = TrainingDay.query.filter_by(user_id=user_id).order_by(TrainingDay.training_date).all()
    if not training_days:
        return jsonify([]), 200
    
    return jsonify([day.to_dict() for day in training_days]), 200

# --- Inicialización de la base de datos ---
if __name__ == '__main__':
    # Asegúrate de que la base de datos se haya inicializado y las tablas existan
    # Esto ya lo tienes en el bloque `with app.app_context(): db.create_all()`
    app.run(host='0.0.0.0', port=5000, debug=os.environ.get('FLASK_DEBUG') == '1')