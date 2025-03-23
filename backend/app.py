from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate = Migrate(app, db)

    # Importa tus modelos para que Flask-Migrate los detecte
    from api.models import User, Food, Meal, Diet, Routine, ProgressRecord, Notification, Message 

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
