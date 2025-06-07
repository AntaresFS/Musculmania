from flask import Blueprint, request, jsonify
from .models import Item, db

bp = Blueprint('main', __name__, url_prefix='/api')

@bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({'message': '¡Hola desde Flask + SQLAlchemy!'}), 200

@bp.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([i.to_dict() for i in items]), 200

@bp.route('/items', methods=['POST'])
def create_item():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': "Falta 'name'"}), 400
    item = Item(name=name)
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201
