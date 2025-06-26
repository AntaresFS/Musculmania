# backend/app.py
import os
from flask import Flask, jsonify, request # Importa 'request' para acceder a los datos de la petición
from flask_cors import CORS
from dotenv import load_dotenv
from .models import db, Project, User # Importa el modelo User
from sqlalchemy.exc import IntegrityError # Importa IntegrityError para manejar errores de BD
from flask_migrate import Migrate # Importa Flask-Migrate 
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity

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

# Esto es una alternativa si el error 422 persiste o si tu token es más complejo
# @jwt.user_identity_loader
# def user_identity_lookup(user_object):
#     return {'id': user_object.id} # Retorna la identidad que se guardará en el token


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

if __name__ == '__main__':
    # Asegúrate de que la base de datos se haya inicializado y las tablas existan
    # Esto ya lo tienes en el bloque `with app.app_context(): db.create_all()`
    app.run(host='0.0.0.0', port=5000, debug=os.environ.get('FLASK_DEBUG') == '1')