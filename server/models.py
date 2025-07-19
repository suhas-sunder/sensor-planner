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
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.ext.hybrid import hybrid_property
import json

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
    __tablename__ = "sensor"

    id = db.Column(db.String, primary_key=True)
    sensor_type = db.Column(db.String, nullable=False)

    x = db.Column(db.Float, nullable=False)
    y = db.Column(db.Float, nullable=False)
    prev_x = db.Column("prev_x", db.Float, default=0.0)
    prev_y = db.Column("prev_y", db.Float, default=0.0)

    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    room_coverage_area = db.Column(db.Float, nullable=False)

    # internal storage for JSON fields
    _overlapping_sensors = db.Column("overlapping_sensors", db.JSON, default=[])
    _connected_devices = db.Column("connected_devices", db.JSON, default=[])

    sensor_rad = db.Column(db.Float, nullable=False)
    mounted_to = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean, default=False)
    floor_id = db.Column(db.String, nullable=False)

    # Property getter/setters with fallback for legacy/bad data
    @property
    def overlapping_sensors(self):
        raw = self._overlapping_sensors
        if isinstance(raw, str):
            return [s.strip() for s in raw.split(',') if s.strip()]
        return raw or []

    @overlapping_sensors.setter
    def overlapping_sensors(self, value):
        self._overlapping_sensors = value

    @property
    def connected_devices(self):
        raw = self._connected_devices
        if isinstance(raw, str):
            return [s.strip() for s in raw.split(',') if s.strip()]
        return raw or []

    @connected_devices.setter
    def connected_devices(self, value):
        self._connected_devices = value

    def __repr__(self):
        return f"<Sensor {self.id} in {self.mounted_to} (Active: {self.active})>"
  
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