from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
#from flask_cors import CORS

app = Flask(__name__)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JWT_SECRET_KEY'] = '801jfasfFDS9843afd7d'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config["DEBUG"] = True
db = SQLAlchemy(app)
db.init_app(app)

from .auth import auth as auth_blueprint
app.register_blueprint(auth_blueprint)
from .views import main as main_blueprint
app.register_blueprint(main_blueprint)
        
    

   