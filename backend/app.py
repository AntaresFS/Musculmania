import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from os import getenv
from dotenv import load_dotenv

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'test.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = getenv('JWT_SECRET_KEY')

    db.init_app(app)
    MIGRATE = Migrate(app, db, compare_type=True)
    JWTManager(app)

    # Importa tus modelos para que Flask-Migrate los detecte
    from api.models import User, Food, Meal, Diet, Routine, ProgressRecord, Notification, Message

    # Registrar blueprint de la API
    from backend.api.routes import api
    app.register_blueprint(api, url_prefix='/api') 

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
