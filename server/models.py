 
from datetime import datetime
import uuid
from flask_sqlalchemy import SQLAlchemy


 
db = SQLAlchemy()




class Session(db.Model):
  

   __tablename__ = "session"


   id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
   name = db.Column(db.String, nullable=False)
   created_at = db.Column(db.DateTime, default=datetime.utcnow)


   # A session can own many layouts (floors).
   layouts = db.relationship(
       "Layout",
       backref="owner",
       cascade="all, delete-orphan",
       lazy=True,
   )


   def to_dict(self) -> dict:
       
       return {
           "id": self.id,
           "name": self.name,
       }




class Layout(db.Model):
    

   __tablename__ = "layout"


   id = db.Column(db.String, primary_key=True, default=lambda: f"layout-{uuid.uuid4().hex[:8]}")
   name = db.Column(db.String, nullable=False)


  
   owner_session_id = db.Column(
       db.String,
       db.ForeignKey("session.id", ondelete="CASCADE"),
       nullable=False,
   )

 
   rooms = db.relationship(
       "Room",
       backref="layout",
       cascade="all, delete-orphan",
       lazy=True,
   )


 
   devices = db.relationship(
       "Device",
       backref="layout",
       cascade="all, delete-orphan",
       lazy=True,
       foreign_keys="Device.floor",
   )


  
   sensors = db.relationship(
       "Sensor",
       backref="layout",
       cascade="all, delete-orphan",
       lazy=True,
       foreign_keys="Sensor.floor",
   )


  
   persons = db.relationship(
       "Person",
       backref="layout",
       cascade="all, delete-orphan",
       lazy=True,
       foreign_keys="Person.floor",
   )


  
   events = db.relationship(
       "SimulationEvent",
       backref="layout",
       cascade="all, delete-orphan",
       lazy=True,
       foreign_keys="SimulationEvent.floor",
   )




class Room(db.Model):
  


   __tablename__ = "room"


   id = db.Column(db.String, primary_key=True, default=lambda: f"room-{uuid.uuid4().hex[:6]}")
   name = db.Column(db.String, nullable=False)
   layout_id = db.Column(
       db.String,
       db.ForeignKey("layout.id", ondelete="CASCADE"),
       nullable=False,
   )
   x = db.Column(db.Float, nullable=False)
   y = db.Column(db.Float, nullable=False)
   width = db.Column(db.Float, nullable=False)
   height = db.Column(db.Float, nullable=False)
   date_created = db.Column(db.DateTime, default=datetime.utcnow)
   date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)




class Device(db.Model):
    

   __tablename__ = "device"


   id = db.Column(db.String, primary_key=True)
   x = db.Column(db.Float, nullable=False)
   y = db.Column(db.Float, nullable=False)
 
   type = db.Column(db.String, nullable=False)
   label = db.Column(db.String, nullable=False)
   name = db.Column(db.String, nullable=False)
   device_rad = db.Column(db.Float, nullable=False)
  
   connectivity = db.Column(db.JSON, nullable=False, default=list)
 
   compatibleSensors = db.Column(db.JSON, nullable=False, default=list)
   
   interferenceProtocols = db.Column(db.JSON, nullable=False, default=list)
 
   connectedSensorIds = db.Column(db.JSON, nullable=True, default=list)
 
   interferenceIds = db.Column(db.JSON, nullable=True, default=list)
 
   floor = db.Column(db.String, db.ForeignKey("layout.id"), nullable=False)
   date_created = db.Column(db.DateTime, default=datetime.utcnow)
   date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
 
   logs = db.relationship("Log", backref="device", lazy=True)




class Sensor(db.Model):
    

   __tablename__ = "sensor"


   id = db.Column(db.String, primary_key=True)
   x = db.Column(db.Float, nullable=False)
   y = db.Column(db.Float, nullable=False)
   type = db.Column(db.String, nullable=False)
   name = db.Column(db.String, nullable=False)
   sensor_rad = db.Column(db.Float, nullable=False)
 
   connectivity = db.Column(db.JSON, nullable=False, default=list)
 
   connectedDeviceIds = db.Column(db.JSON, nullable=True, default=list)
    
   interferenceIds = db.Column(db.JSON, nullable=True, default=list)
 
   floor = db.Column(
       db.String,
       db.ForeignKey("layout.id", ondelete="CASCADE"),
       nullable=False,
   )
   date_created = db.Column(db.DateTime, default=datetime.utcnow)
   date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


   def __repr__(self) -> str:
       return f"<Sensor {self.id} on floor {self.floor}>"




class Person(db.Model):
   

   __tablename__ = "person"


   id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
   name = db.Column(db.String, nullable=False)
   # The ID of the owning layout (floor)
   floor = db.Column(
       db.String,
       db.ForeignKey("layout.id", ondelete="CASCADE"),
       nullable=False,
   )
 
   path = db.Column(db.JSON, nullable=False, default=list)
 
   currentIndex = db.Column(db.Integer, nullable=False, default=0)
 
   direction = db.Column(db.Integer, nullable=False, default=1)
    
   color = db.Column(db.String, nullable=True)
 
   animationSpeed = db.Column(db.Float, nullable=False)
 
   progress = db.Column(db.Float, nullable=True)
   date_created = db.Column(db.DateTime, default=datetime.utcnow)
   date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


   def to_dict(self) -> dict:
       """Serialise the person to a dictionary for JSON responses."""
       return {
           "id": self.id,
           "name": self.name,
           "floor": self.floor,
           "path": self.path,
           "currentIndex": self.currentIndex,
           "direction": self.direction,
           "color": self.color,
           "animationSpeed": self.animationSpeed,
           "progress": self.progress,
           "date_created": self.date_created.isoformat() if self.date_created else None,
           "date_modified": self.date_modified.isoformat() if self.date_modified else None,
       }


   def __repr__(self) -> str:
       return f"<Person {self.id} on floor {self.floor}>"




class SimulationEvent(db.Model):
   
   __tablename__ = "simulation_event"


   id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
 
   floor = db.Column(
       db.String,
       db.ForeignKey("layout.id", ondelete="CASCADE"),
       nullable=False,
   )
 
   node_id = db.Column(db.String, nullable=False)
 
   node_type = db.Column(db.String, nullable=False)
 
   event_type = db.Column(db.String, nullable=False)
  
   timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  
   message = db.Column(db.String, nullable=False)
   date_created = db.Column(db.DateTime, default=datetime.utcnow)
   date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


   def to_dict(self) -> dict:
      
       ts_ms = int(self.timestamp.timestamp() * 1000) if self.timestamp else None
       return {
           "id": self.id,
           "floor": self.floor,
           "nodeId": self.node_id,
           "nodeType": self.node_type,
           "eventType": self.event_type,
           "timestamp": ts_ms,
           "message": self.message,
           "date_created": self.date_created.isoformat() if self.date_created else None,
           "date_modified": self.date_modified.isoformat() if self.date_modified else None,
       }


   def __repr__(self) -> str:
       return f"<SimulationEvent {self.id} on floor {self.floor} type={self.event_type}>"




class Log(db.Model):
   

   __tablename__ = "log"


   id = db.Column(db.Integer, primary_key=True, autoincrement=True)
   timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
   event = db.Column(db.String, nullable=False)
 
   device_id = db.Column(db.String, db.ForeignKey("device.id", ondelete="SET NULL"), nullable=True)
   sensor_id = db.Column(db.String, db.ForeignKey("sensor.id", ondelete="SET NULL"), nullable=True)
   owner_session_id = db.Column(db.String, db.ForeignKey("session.id", ondelete="SET NULL"), nullable=True)
 
   room = db.Column(db.String, nullable=True)
 
   floor_id = db.Column(db.String, db.ForeignKey("layout.id", ondelete="SET NULL"), nullable=True)
   effect = db.Column(db.String, nullable=True)
   user_action = db.Column(db.Boolean, default=False)


   def __repr__(self) -> str:
       return f"<Log {self.timestamp}: {self.event} (device={self.device_id})>"










