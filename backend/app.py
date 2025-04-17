from flask import Flask, request, jsonify

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from os import path
import json

from flask_cors import CORS



db = SQLAlchemy()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text(), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

DB_NAME = 'database.db'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DB_NAME

CORS(app)

db.init_app(app)

if not path.exists('src/' + DB_NAME):
    with app.app_context():
        db.create_all()

@app.route("/listtasks")
def listtasks():
    tasks = Task.query.all()
    response = []

    for task in tasks:
        response.append({"title": task.title, "id": task.id, "created_at": task.created_at, "completed": task.completed, "description": task.description})

    print(response)
    return response

@app.route("/create_task", methods=['POST'])
def create_task():
    title = request.json.get("title", None)
    description = request.json.get("description", None)
    completed = request.json.get("completed", None)

    print(completed)

    if not title:
        return {"error": "title not provided"}
    
    if not description:
        return {"error": "description not provided"}
    
    if completed == None:
        return {"error": "completion status not provided"}
    
    if completed == 'true':
        completed = True
    else:
        completed = False

    new_task = Task(title=title, description=description, completed=completed)

    db.session.add(new_task)
    db.session.commit()

    return {"success": "task has been created"}


@app.route("/manage_task", methods=["POST"])
def manage_task():
    id = request.json.get("id", None)

    task = Task.query.filter_by(id=int(id)).first()

    if task.completed == True:
        task.completed = False
    else:
        task.completed = True

    db.session.commit()

    return {"success": "task status change", "status": task.completed}




if __name__ == "__main__":
    app.run(debug = True, host='0.0.0.0', port = 5090)