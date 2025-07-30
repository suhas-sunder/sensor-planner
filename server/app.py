 


from datetime import datetime
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS




from models import (
   db,
   Device,
   Sensor,
   Session,
   Layout,
   Room,
   Log,
   Person,
   SimulationEvent,
)




app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # dev only

 
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///smart.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


 
db.init_app(app)




def create_tables() -> None:
   
   db.create_all()




@app.route("/layouts/<layout_id>/devices", methods=["GET", "POST"])
def get_devices(layout_id: str):
   
   if request.method == "POST":
       return add_or_update_device(layout_id)


  
   devices = Device.query.filter_by(floor=layout_id).all()
   result = []
   for device in devices:
       result.append({
           "id": device.id,
           "x": device.x,
           "y": device.y,
           "type": device.type,
           "label": device.label,
           "name": device.name,
           "device_rad": device.device_rad,
           "connectivity": device.connectivity,
           "compatibleSensors": device.compatibleSensors,
           "interferenceProtocols": device.interferenceProtocols,
           "connectedSensorIds": device.connectedSensorIds,
           "interferenceIds": device.interferenceIds,
           "floor": device.floor,
           "date_created": device.date_created.isoformat() if device.date_created else None,
           "date_modified": device.date_modified.isoformat() if device.date_modified else None,
       })
   return jsonify(result), 200




def add_or_update_device(layout_id: str):
   
   try:
       data = request.get_json(force=True)
       if not data or "id" not in data:
           return jsonify({"error": "Device ID is required"}), 400


       # Attempt to fetch an existing device
       device = Device.query.get(data["id"])


       if device:
           # Update existing device fields
           device.x = data["x"]
           device.y = data["y"]
           device.type = data["type"]
           device.label = data["label"]
           device.name = data["name"]
           device.device_rad = data["device_rad"]
           device.connectivity = data.get("connectivity", [])
           device.compatibleSensors = data.get("compatibleSensors", [])
           device.interferenceProtocols = data.get("interferenceProtocols", [])
           device.connectedSensorIds = data.get("connectedSensorIds", [])
           device.interferenceIds = data.get("interferenceIds", [])
           # Update the owning layout/floor
           device.floor = layout_id
           device.date_modified = datetime.utcnow()
           message = "Device updated"
           status = 200
       else:
           # Create new device instance
           device = Device(
               id=data["id"],
               x=data["x"],
               y=data["y"],
               type=data["type"],
               label=data["label"],
               name=data["name"],
               device_rad=data["device_rad"],
               connectivity=data.get("connectivity", []),
               compatibleSensors=data.get("compatibleSensors", []),
               interferenceProtocols=data.get("interferenceProtocols", []),
               connectedSensorIds=data.get("connectedSensorIds", []),
               interferenceIds=data.get("interferenceIds", []),
               floor=layout_id,
               date_created=datetime.utcnow(),
               date_modified=datetime.utcnow(),
           )
           db.session.add(device)
           message = "Device added"
           status = 201


       db.session.commit()
       return jsonify({"message": message}), status


   except Exception as e:
       db.session.rollback()
       return jsonify({"error": str(e)}), 400




@app.route("/layouts/<layout_id>/devices/<device_id>", methods=["DELETE"])
def delete_device(layout_id: str, device_id: str):
    
   try:
       # Query by id and owning floor
       device = Device.query.filter_by(id=device_id, floor=layout_id).first()
       if device is None:
           return jsonify({"error": "Device not found"}), 404


       db.session.delete(device)
       db.session.commit()
       return jsonify({"message": f"Device '{device_id}' deleted from layout '{layout_id}'."}), 200
   except Exception as e:
       db.session.rollback()
       return jsonify({"error": str(e)}), 500




@app.route('/layouts/<layout_id>/sensors', methods=['GET'])
def get_motion_sensors(layout_id: str):
   
   try:
       # Filter by layout ID and sensor type
       sensors = Sensor.query.filter_by(floor=layout_id, type="motion").all()
       result = []
       for sensor in sensors:
           result.append({
               "id": sensor.id,
               "type": sensor.type,
               "name": sensor.name,
               "x": sensor.x,
               "y": sensor.y,
               "sensor_rad": sensor.sensor_rad,
               "connectivity": sensor.connectivity,
               "connectedDeviceIds": sensor.connectedDeviceIds,
               "interferenceIds": sensor.interferenceIds,
               "floor": sensor.floor,
               "date_created": sensor.date_created.isoformat() if sensor.date_created else None,
               "date_modified": sensor.date_modified.isoformat() if sensor.date_modified else None,
           })
       return jsonify(result), 200
   except Exception as e:
       return jsonify({"error": str(e)}), 500




@app.route("/layouts/<layout_id>/sensors", methods=["POST"])
def add_or_update_sensor(layout_id: str):
   
 
   try:
       data = request.get_json(force=True)
       if not data or "id" not in data:
           return jsonify({"error": "Sensor ID is required"}), 400


       sensor = Sensor.query.get(data["id"])
       if sensor:
           # Update existing sensor
           sensor.type = data.get("type", sensor.type)
           sensor.name = data.get("name", sensor.name)
           sensor.x = data.get("x", sensor.x)
           sensor.y = data.get("y", sensor.y)
           sensor.sensor_rad = data.get("sensor_rad", sensor.sensor_rad)
           sensor.connectivity = data.get("connectivity", sensor.connectivity)
           sensor.connectedDeviceIds = data.get("connectedDeviceIds", sensor.connectedDeviceIds)
           sensor.interferenceIds = data.get("interferenceIds", sensor.interferenceIds)
           sensor.floor = layout_id
           sensor.date_modified = datetime.utcnow()
       else:
           # Create new sensor
           sensor = Sensor(
               id=data["id"],
               type=data["type"],
               name=data["name"],
               x=data["x"],
               y=data["y"],
               sensor_rad=data["sensor_rad"],
               connectivity=data.get("connectivity", []),
               connectedDeviceIds=data.get("connectedDeviceIds", []),
               interferenceIds=data.get("interferenceIds", []),
               floor=layout_id,
               date_created=datetime.utcnow(),
               date_modified=datetime.utcnow(),
           )
           db.session.add(sensor)


       db.session.commit()
       return jsonify({"message": "Sensor saved successfully"}), 200
   except Exception as e:
       db.session.rollback()
       return jsonify({"error": str(e)}), 500




@app.route("/layouts/<layout_id>/sensors/<sensor_id>", methods=["DELETE"])
def delete_sensor(layout_id: str, sensor_id: str):
   
   try:
       sensor = Sensor.query.filter_by(id=sensor_id, floor=layout_id).first()
       if not sensor:
           return jsonify({"error": "Sensor not found"}), 404
       db.session.delete(sensor)
       db.session.commit()
       return jsonify({"message": f"Sensor '{sensor_id}' deleted successfully."}), 200
   except Exception as e:
       db.session.rollback()
       return jsonify({"error": str(e)}), 500




 

@app.route("/layouts/<layout_id>/persons", methods=["GET"])
def get_persons(layout_id: str):
   
   try:
       persons = Person.query.filter_by(floor=layout_id).all()
       result = [person.to_dict() for person in persons]
       return jsonify(result), 200
   except Exception as e:
       return jsonify({"error": str(e)}), 500




@app.route("/layouts/<layout_id>/persons", methods=["POST"])
def add_or_update_person(layout_id: str):
  
   try:
       data = request.get_json(force=True)
       if not data or "id" not in data:
           return jsonify({"error": "Person ID is required"}), 400
       if "name" not in data:
           return jsonify({"error": "Person name is required"}), 400
       if "animationSpeed" not in data:
           return jsonify({"error": "animationSpeed is required"}), 400
       person = Person.query.get(data["id"])
       if person:
           # Update existing person
           person.name = data.get("name", person.name)
           person.floor = layout_id
           person.path = data.get("path", person.path)
           person.currentIndex = data.get("currentIndex", person.currentIndex)
           person.direction = data.get("direction", person.direction)
           person.color = data.get("color", person.color)
           person.animationSpeed = data.get("animationSpeed", person.animationSpeed)
           person.progress = data.get("progress", person.progress)
           person.date_modified = datetime.utcnow()
           message = "Person updated"
           status = 200
       else:
           # Create new person
           person = Person(
               id=data["id"],
               name=data["name"],
               floor=layout_id,
               path=data.get("path", []),
               currentIndex=data.get("currentIndex", 0),
               direction=data.get("direction", 1),
               color=data.get("color"),
               animationSpeed=data["animationSpeed"],
               progress=data.get("progress"),
               date_created=datetime.utcnow(),
               date_modified=datetime.utcnow(),
           )
           db.session.add(person)
           message = "Person added"
           status = 201
       db.session.commit()
       return jsonify({"message": message}), status
   except Exception as e:
       db.session.rollback()
       return jsonify({"error": str(e)}), 500




 


@app.route("/layouts/<layout_id>/events", methods=["GET"])
def get_simulation_events(layout_id: str):
   
   try:
       events = SimulationEvent.query.filter_by(floor=layout_id).all()
       result = [event.to_dict() for event in events]
       return jsonify(result), 200
   except Exception as e:
       return jsonify({"error": str(e)}), 500




@app.route("/layouts/<layout_id>/events", methods=["POST"])
def add_or_update_simulation_event(layout_id: str):
   
   try:
       data = request.get_json(force=True)
       if not data or "id" not in data:
           return jsonify({"error": "Event ID is required"}), 400
       # Required fields
       required = ["nodeId", "nodeType", "eventType", "message"]
       for field in required:
           if field not in data:
               return jsonify({"error": f"{field} is required"}), 400
       # Parse timestamp in milliseconds since epoch
       ts_value = data.get("timestamp")
       if ts_value is not None:
           try:
               # allow numeric or string representation
               ts_ms = float(ts_value)
               event_time = datetime.utcfromtimestamp(ts_ms / 1000.0)
           except Exception:
               return jsonify({"error": "Invalid timestamp value"}), 400
       else:
           event_time = datetime.utcnow()
       event = SimulationEvent.query.get(data["id"])
       if event:
           # Update existing event
           event.floor = layout_id
           event.node_id = data.get("nodeId", event.node_id)
           event.node_type = data.get("nodeType", event.node_type)
           event.event_type = data.get("eventType", event.event_type)
           event.timestamp = event_time
           event.message = data.get("message", event.message)
           event.date_modified = datetime.utcnow()
           message = "Event updated"
           status = 200
       else:
           # Create new event
           event = SimulationEvent(
               id=data["id"],
               floor=layout_id,
               node_id=data["nodeId"],
               node_type=data["nodeType"],
               event_type=data["eventType"],
               timestamp=event_time,
               message=data["message"],
               date_created=datetime.utcnow(),
               date_modified=datetime.utcnow(),
           )
           db.session.add(event)
           message = "Event added"
           status = 201
       db.session.commit()
       return jsonify({"message": message}), status
   except Exception as e:
       db.session.rollback()
       return jsonify({"error": str(e)}), 500




@app.route("/session", methods=["POST"])
def create_session():
   """Create a new session."""
   data = request.get_json(force=True)
   name = data.get("name")
   if not name:
       return jsonify({"error": "Name is required"}), 400
   new_session = Session(name=name)
   db.session.add(new_session)
   db.session.commit()
   return jsonify(new_session.to_dict()), 201




@app.route("/session/<id>", methods=["GET"])
def get_session(id: str):
   """Retrieve session details by ID."""
   session = Session.query.get(id)
   if not session:
       return jsonify({"error": "Session not found"}), 404
   return jsonify(session.to_dict()), 200




@app.route("/layouts", methods=["POST"])
def create_layout_with_rooms():
  
   data = request.get_json(force=True)
   try:
       layout = Layout(
           id=data.get("id", f"layout-{uuid.uuid4().hex[:8]}"),
           name=data["name"],
           owner_session_id=data["owner_session_id"],
       )
       rooms_data = data.get("rooms", [])
       for room_data in rooms_data:
           room = Room(
               id=room_data.get("id", f"room-{uuid.uuid4().hex[:8]}"),
               name=room_data["name"],
               layout=layout,  # attach the room to layout directly
               x=room_data["x"],
               y=room_data["y"],
               width=room_data["width"],
               height=room_data["height"],
           )
           db.session.add(room)
       db.session.add(layout)
       db.session.commit()
       return jsonify({"message": "Layout and rooms created successfully", "layout_id": layout.id}), 201
   except Exception as e:
       db.session.rollback()
       return jsonify({"error": str(e)}), 400




@app.route("/layouts", methods=["GET"])
def get_all_layouts():
   """Return a list of all layouts and their rooms."""
   layouts = Layout.query.all()
   result = []
   for layout in layouts:
       layout_data = {
           "id": layout.id,
           "name": layout.name,
           "owner_session_id": layout.owner_session_id,
           "rooms": [
               {
                   "id": room.id,
                   "name": room.name,
                   "x": room.x,
                   "y": room.y,
                   "width": room.width,
                   "height": room.height,
               }
               for room in layout.rooms
           ],
       }
       result.append(layout_data)
   return jsonify(result), 200




@app.route('/layouts/<string:layout_id>', methods=['DELETE'])
def delete_layout(layout_id: str):
   
   try:
       layout = Layout.query.filter_by(id=layout_id).first()
       if not layout:
           return jsonify({"error": "Layout not found"}), 404
       # Delete devices and sensors on this layout
       Device.query.filter_by(floor=layout_id).delete(synchronize_session=False)
       Sensor.query.filter_by(floor=layout_id).delete(synchronize_session=False)
       # Delete rooms (cascades to nothing else now)
       Room.query.filter_by(layout_id=layout_id).delete(synchronize_session=False)
       # Delete the layout itself
       db.session.delete(layout)
       db.session.commit()
       return jsonify({"message": f"Layout {layout_id} deleted successfully"}), 200
   except Exception as e:
       db.session.rollback()
       return jsonify({"error": str(e)}), 500




@app.route('/logs', methods=['POST'])
def log_event():
   
   try:
       data = request.get_json(force=True)
       new_log = Log(
           timestamp=datetime.fromisoformat(data.get('timestamp')) if data.get('timestamp') else datetime.utcnow(),
           event=data['event'],
           sensor_id=data.get('sensor_id'),
           device_id=data.get('target_device_id'),
           owner_session_id=data.get('owner_session_id'),
           room=data.get('room'),  # room name
           floor_id=data.get('floor-id'),  # JSON uses 'floor-id' not 'floor_id'
           effect=data.get('effect'),
           user_action=bool(data.get('user_action', False)),
       )
       db.session.add(new_log)
       db.session.commit()
       return jsonify({"message": "Event logged successfully"}), 201
   except Exception as e:
       db.session.rollback()
       return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    with app.app_context():
        create_tables()
    app.run(debug=True, host="0.0.0.0", port=5000)

