from . import db

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)
    masterkey = db.Column(db.String(60), nullable=False)
    refresh = db.Column(db.String(60), nullable=True)
    

class Program(db.Model):
    __tablename__ = 'program'
    program_id = db.Column(db.Integer, primary_key=True)
    program = db.Column(db.String(30), nullable=False)
    username = db.Column(db.String(30), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    index = db.Column(db.Integer, nullable=True)
    