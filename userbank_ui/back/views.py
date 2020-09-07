from flask import Blueprint, jsonify, render_template, request
from . import db, app
from .models import Program
from datetime import datetime
import flask_jwt_extended as jwt
from sqlalchemy.exc import IntegrityError, OperationalError
from .auth import decode_identity, gain_access

main = Blueprint('main', __name__)

@main.route('/')
def index():  
    return render_template("index.html")

# view, add or remove programs 
@main.route('/programs', methods=['GET'])
@gain_access
def view_programs():
    #view all users saved programs
    try:
        token = request.headers.get('Authorization')[7:]
        if not token or token == 'null' or token == 'undefined':   
            token = request.cookies.get('token')
        if not token or token == 'null' or token == 'undefined':
            return jsonify({"msg": "no token"})
    except TypeError:
            return jsonify({"msg": "no token"})
        
    if request.method == 'GET':
        data = jwt.decode_token(token)
        
        # token = request.args.get('token')
        identity = decode_identity(token)
        programs_list = db.session.query(Program).filter_by(user_id = identity['id'])
        programs = []
        for item in programs_list:
            programs.append({
                'program': item.program, 
                'username': item.username, 
                'password': item.password, 
                'id': item.program_id, 
                'idx': item.index})
        return jsonify({'programs': programs})
    else:    
        return jsonify({"msg": "Invalid authorization"})

@main.route('/remove-program', methods=['POST'])
@jwt.jwt_required
def remove_program():
    try:
        program_data = request.get_json()
        gain_access(program_data)
        db.session.query(Program).filter_by(
            program=program_data['program'],
            username=program_data['username'],
            user_id=program_data['id']).delete()
        db.session.commit()
    except (IntegrityError, OperationalError):
        return jsonify({"err": "error while trying to remove program"}), 204

    return jsonify({"msg": "removed"}), 201

@main.route('/add-program', methods=['POST'])
@jwt.jwt_required
def add_program():
    try:
        program_data = request.get_json()
        new_program = Program(program=program_data['program'],
            username=program_data['username'],
            password=program_data['password'],
            user_id=program_data['id'],
            index=program_data['index'])
        db.session.add(new_program)
        db.session.commit()
    except (IntegrityError, OperationalError):
        return jsonify({"err": "error while trying to add program"}), 204

    return jsonify({"msg": f"added {program_data['program']}"}), 201

@main.route('/change-credentials', methods=['POST'])
@jwt.jwt_required
def change_credentials():
    try:
        program_data = request.get_json()
        change_program = Program.query.filter_by(
            user_id=program_data['user_id'],
            index=program_data['index']).first()
        if 'program' in program_data:
            change_program.program = program_data['program']
        if 'username' in program_data:
            change_program.username = program_data['username']
        if 'password' in program_data:
            change_program.password = program_data['password']
        db.session.commit()
    except (IntegrityError, OperationalError):
        return jsonify({"err": "error while trying to change credentials"}), 204
    except AttributeError:
        return jsonify({"err": "error while adding application data"})

    return jsonify({'msg': f"credentials changed for {change_program.program}"}), 201

