# seed.py
"""
Populate the SQLite database with sample data (idempotent).

How to run:
    python seed.py

The database file will be created under Flask's instance folder:
    <project_root>/instance/smart.db
"""

import os
from datetime import datetime
from flask import Flask
from models import db, Device, Sensor  # import the tables defined in models.py

# ----------------------------------------------------------------------
# 1. Create a Flask app whose instance folder will hold the DB file
# ----------------------------------------------------------------------
app = Flask(__name__, instance_relative_config=True)

# Ensure the instance directory exists
os.makedirs(app.instance_path, exist_ok=True)

# Absolute path to instance/smart.db
db_path = os.path.join(app.instance_path, "smart.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# ----------------------------------------------------------------------
# 2. Sample data you can edit or extend
# ----------------------------------------------------------------------
DEMO_DEVICES = [
    {"id": "light_living", "type": "light", "state": {"on": False}},
    {"id": "door_front",   "type": "door",  "state": {"locked": True}},
]

DEMO_SENSORS = [
    {"id": "occupancy_living", "room": "living", "reading": {"occupied": False}},
]
# ----------------------------------------------------------------------

def seed_devices() -> int:
    """
    Insert demo devices if they do not yet exist.
    Returns the number of rows inserted.
    """
    inserted = 0
    for d in DEMO_DEVICES:
        if not Device.query.get(d["id"]):
            db.session.add(Device(**d))
            inserted += 1
    return inserted


def seed_sensors() -> int:
    """
    Insert demo sensors if they do not yet exist.
    Returns the number of rows inserted.
    """
    inserted = 0
    for s in DEMO_SENSORS:
        if not Sensor.query.get(s["id"]):
            db.session.add(Sensor(**s))
            inserted += 1
    return inserted


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Safe even if tables already exist
        n_dev = seed_devices()
        n_sen = seed_sensors()
        db.session.commit()

        print(f"✅ Seeding complete: added {n_dev} devices, {n_sen} sensors")
        print("UTC timestamp :", datetime.utcnow().isoformat())
        print("Database file :", db_path)
