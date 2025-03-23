import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'

db = SQLAlchemy(app)