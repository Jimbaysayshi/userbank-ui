from flask import Blueprint, jsonify, request, redirect, make_response
from . import app,db, bcrypt
from .models import User
import datetime
import flask_jwt_extended as jwt
from functools import wraps
from sqlalchemy.exc import IntegrityError, OperationalError

auth = Blueprint('auth', __name__) 
def hash_masterkey(masterkey):
    
    key = bcrypt.generate_password_hash(masterkey).decode('utf-8')
    return key

def decode_identity(token):
    
    data = jwt.decode_token(token, app.config['SECRET_KEY'], allow_expired=False)
    identity = data.get('identity')
    return identity

@auth.route('/login', methods=['POST'])
def login():
    
    user_data = request.get_json()
    username = user_data['username']
    key = user_data['masterkey']
    try:
        user = db.session.query(User).filter_by(name=username).first()
        
        if bcrypt.check_password_hash(user.masterkey, key):
            access_token = jwt.create_access_token(
                identity={"id": user.id, "name": user.name},
                fresh=True, 
                expires_delta=datetime.timedelta(minutes=10))
            
            refresh_token = jwt.create_refresh_token(
                identity={"id": user.id, "name": user.name},
                expires_delta=datetime.timedelta(minutes=60))
            result = jsonify({
                "token": access_token, 
                "id": user.id, 
                "refresh_token": refresh_token}) 
        else:
            result = jsonify({"err": "Invalid username or masterkey"})
    except (AttributeError, OperationalError):
        result = jsonify({"err": "Invalid username or masterkey"})

    return result


@auth.route('/logout', methods=['POST'])
def logout():
    return 'Logout'

@auth.route('/signup', methods=['POST'])
def signup():
    try:
        user_data = request.get_json()
        username = user_data['username']
        key = hash_masterkey(user_data['masterkey'])
        new_user = User(name=username, masterkey=key)

        db.session.add(new_user)
        db.session.commit()
        result = {"success": f"User {username} created"}

    except IntegrityError:
        result = {"err": f"User {username} already exists"}

    return jsonify(result)


def user_cookie(result):
    response = make_response()
    response.set_cookie('token', result['token'])
    response.set_cookie('refresh_token', result['refresh_token'])
    return response


#@auth.route('/check-token', methods=['POST'])
def gain_access(fn):
    @wraps(fn)
    def access_wrapper(*args, **kwargs):
        try:
            token = request.headers.get('Authorization')[7:]
            if token != 'null' and token != 'undefined':
                pass
            elif 'token' in request.cookies:
                token = request.cookies.get('token')      
                identity = decode_identity(token)
            else: 
                result = {'err': 'no token'}
        except TypeError:
            pass
        if token != 'null' and token != 'undefined': 
            return fn(*args, **kwargs)
        
        else:
            try: 
                refresh_token = request.cookies.get('refresh_token')
                token = decode_identity(refresh_token)
            except TypeError:
                return {'err': 'no token'}
            if token != 'null' and token != 'undefined':
                try:
                    user = db.session.query(User).filter_by(name=token['name'], id=token['id']).first()
                    access_token = jwt.create_access_token(
                        identity={"id": user.id, "name": user.name},
                        fresh=True, 
                        expires_delta=datetime.timedelta(minutes=10))
                    refresh_token = jwt.create_refresh_token(
                        identity={"id": user.id, "name": user.name},
                        expires_delta=datetime.timedelta(minutes=60))
                    result = {
                        "token": access_token, 
                        "id": user.id, 
                        "refresh_token": refresh_token}
                    
                    
                    user_cookie(result)
                    return fn(*args, **kwargs)
                except (IntegrityError, OperationalError):
                    return  {'err': 'invalid refresh token'}

        return fn(*args, **kwargs)
    return access_wrapper

