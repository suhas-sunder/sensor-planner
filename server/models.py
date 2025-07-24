from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import uuid
import json

db = SQLAlchemy()

### --- SESSION ---
class Session(db.Model):
    __tablename__ = "session"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    layouts = db.relationship("Layout", backref="owner", cascade="all, delete-orphan", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

### --- LAYOUT / FLOOR ---
class Layout(db.Model):
    __tablename__ = "layout"

    id = db.Column(db.String, primary_key=True, default=lambda: f"layout-{uuid.uuid4().hex[:8]}")
    name = db.Column(db.String, nullable=False)

    owner_session_id = db.Column(
        db.String,
        db.ForeignKey("session.id", ondelete="CASCADE"),
        nullable=False
    )

    rooms = db.relationship("Room", backref="layout", cascade="all, delete-orphan", lazy=True)
    devices = db.relationship("Device", backref="floor", cascade="all, delete-orphan", lazy=True)
    sensors = db.relationship("Sensor", backref="floor", cascade="all, delete-orphan", lazy=True)

### --- ROOM ---
class Room(db.Model):
    __tablename__ = "room"

    id = db.Column(db.String, primary_key=True, default=lambda: f"room-{uuid.uuid4().hex[:6]}")
    name = db.Column(db.String, nullable=False)

    layout_id = db.Column(db.String, db.ForeignKey("layout.id", ondelete="CASCADE"), nullable=False)

    x = db.Column(db.Float, nullable=False)
    y = db.Column(db.Float, nullable=False)
    width = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)

    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    devices = db.relationship("Device", backref="room", lazy=True)
    sensors = db.relationship("Sensor", backref="room", lazy=True)

### --- DEVICE ---
class Device(db.Model):
    __tablename__ = "device"

    id = db.Column(db.String, primary_key=True)
    device_type = db.Column(db.String, nullable=False)
    x = db.Column(db.Integer, nullable=False)
    y = db.Column(db.Integer, nullable=False)
    prev_x = db.Column(db.Integer, nullable=True)
    prev_y = db.Column(db.Integer, nullable=True)
    coverage_rad = db.Column(db.Integer, nullable=True)
    active = db.Column(db.Boolean, default=False)
    state = db.Column(db.String, nullable=False)

    mounted_to = db.Column(db.String, db.ForeignKey("room.id", ondelete="SET NULL"), nullable=True)
    floor_id = db.Column(db.String, db.ForeignKey("layout.id", ondelete="CASCADE"), nullable=False)

    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    logs = db.relationship("Log", backref="device", lazy=True)

### --- SENSOR ---
class Sensor(db.Model):
    __tablename__ = "sensor"

    id = db.Column(db.String, primary_key=True)
    sensor_type = db.Column(db.String, nullable=False)
    x = db.Column(db.Float, nullable=False)
    y = db.Column(db.Float, nullable=False)
    prev_x = db.Column(db.Float, default=0.0)
    prev_y = db.Column(db.Float, default=0.0)
    sensor_rad = db.Column(db.Float, nullable=False)
    room_coverage_area = db.Column(db.Float, nullable=False)
    active = db.Column(db.Boolean, default=False)

    mounted_to = db.Column(db.String, db.ForeignKey("room.id", ondelete="SET NULL"), nullable=True)
    floor_id = db.Column(db.String, db.ForeignKey("layout.id", ondelete="CASCADE"), nullable=False)

    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    _overlapping_sensors = db.Column(db.JSON, default=[])
    _connected_devices = db.Column(db.JSON, default=[])

    @property
    def overlapping_sensors(self):
        raw = self._overlapping_sensors
        return [s.strip() for s in raw] if isinstance(raw, list) else []

    @overlapping_sensors.setter
    def overlapping_sensors(self, value):
        self._overlapping_sensors = value

    @property
    def connected_devices(self):
        raw = self._connected_devices
        return [s.strip() for s in raw] if isinstance(raw, list) else []

    @connected_devices.setter
    def connected_devices(self, value):
        self._connected_devices = value

    def __repr__(self):
        return f"<Sensor {self.id} in {self.mounted_to} (Active: {self.active})>"

### --- LOG ---
class Log(db.Model):
    __tablename__ = "log"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    event = db.Column(db.String, nullable=False)  # renamed from "action"

    device_id = db.Column(db.String, db.ForeignKey("device.id", ondelete="SET NULL"), nullable=True)
    sensor_id = db.Column(db.String, db.ForeignKey("sensor.id", ondelete="SET NULL"), nullable=True)
    owner_session_id = db.Column(db.String, db.ForeignKey("session.id", ondelete="SET NULL"), nullable=True)

    room = db.Column(db.String, nullable=True)  # now stores room name directly, not FK
    floor_id = db.Column(db.String, db.ForeignKey("layout.id", ondelete="SET NULL"), nullable=True)

    effect = db.Column(db.String, nullable=True)
    user_action = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<Log {self.timestamp}: {self.event} (device={self.device_id})>"
