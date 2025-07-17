# models.py
"""
SQLAlchemy models for the Smart-Building simulation.
Usage:
    from models import db, Device, Sensor, Log
    db.init_app(app)
    with app.app_context():
        db.create_all()
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Device(db.Model):
    """Virtual smart devices (lights, fans, AC, etc.)."""
    __tablename__ = "device"

    id = db.Column(db.String, primary_key=True)             # e.g. "device-123"
    device_type = db.Column(db.String, nullable=False)             # "fan", "light_bulb", etc.
    x = db.Column(db.Integer, nullable=False)               # current x position
    y = db.Column(db.Integer, nullable=False)               # current y position
    prev_x = db.Column(db.Integer, nullable=True)           # previous x position
    prev_y = db.Column(db.Integer, nullable=True)           # previous y position
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    coverage_rad = db.Column(db.Integer, nullable=True)     # radius of effect
    active = db.Column(db.Boolean, default=False)           # whether it's on/working
    mounted_to = db.Column(db.String, nullable=False)       # room name or id
    floor_id = db.Column(db.String, nullable=False)         # layout/floor id
    state = db.Column(db.String, nullable=False)              # JSON status like {"on": true}

    def __repr__(self):
        return f"<Device {self.id} {self.device_type} mounted to {self.mounted_to}>"

class Sensor(db.Model):
    """Optional: room sensors (occupancy, temperature …)."""
    __tablename__ = "sensor"

    id = db.Column(db.String, primary_key=True)      # e.g. "occupancy_living"
    room = db.Column(db.String, nullable=False)      # "living", "kitchen" …
    reading = db.Column(db.JSON, nullable=False)     # {"occupied":false}

    def __repr__(self) -> str:
        return f"<Sensor {self.id} {self.reading}>"


class Log(db.Model):
    """Event log for audits & analytics."""
    __tablename__ = "log"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    device_id = db.Column(
        db.String,
        db.ForeignKey("device.id", ondelete="SET NULL"),
        nullable=True,
    )
    action = db.Column(db.String, nullable=False)   # e.g. "turned_on", "rule_trigger"

    # optional reverse relationship
    device = db.relationship("Device", backref="logs", lazy=True)

    def __repr__(self) -> str:
        return f"<Log {self.device_id} {self.action} @ {self.timestamp}>"
