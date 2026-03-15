from flask_socketio import join_room, leave_room
from extensions import socketio

@socketio.on("connect")
def handle_connect():
    print(f"Client connected")

@socketio.on("join_branch")
def handle_join_branch(data):
    branch = data.get("branch")
    if branch:
        join_room(branch)
        print(f"Client joined branch room: {branch}")

@socketio.on("disconnect")
def handle_disconnect():
    print(f"Client disconnected")