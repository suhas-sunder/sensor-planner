# app.py

from flask import Flask, request, jsonify
from models import db, Device, Sensor, Session
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///smart.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

def create_tables():
    db.create_all()


def create_tables():
    db.create_all()

@app.route("/layouts/<layout_id>/devices", methods=["GET", "POST"])
def get_devices(layout_id):
    print(f"layout_id={layout_id}")

    if request.method == "POST":
        return add_or_update_device(layout_id)

    devices = Device.query.filter_by(floor_id=layout_id).all()

    result = []
    for device in devices:
        result.append({
            "id": device.id,
            "device_type": device.device_type,
            "x": device.x,
            "y": device.y,
            "prev_x": device.prev_x,
            "prev_y": device.prev_y,
            "date_created": device.date_created.isoformat() if device.date_created else None,
            "date_modified": device.date_modified.isoformat() if device.date_modified else None,
            "coverage_rad": device.coverage_rad,
            "active": device.active,
            "mounted_to": device.mounted_to,
            "floor_id": device.floor_id,
            "state": device.state,
        })

    return jsonify(result), 200

def add_or_update_device(layout_id):
    try:
        data = request.get_json(force=True)

        # Look for existing device
        device = Device.query.get(data["id"])

        if device:             
            device.device_type = data["type"]
            device.x = data["x"]
            device.y = data["y"]
            device.prev_x = data["prev_x"]
            device.prev_y = data["prev_y"]
            device.coverage_rad = data["coverage_rad"]
            device.active = data["active"]
            device.mounted_to = data["mounted_to"]
            device.floor_id = layout_id   
            device.state = data["state"]
            device.date_modified = datetime()
            message = "Device updated"
        else:             
            device = Device(
                id=data["id"],
                device_type=data["type"],
                x=data["x"],
                y=data["y"],
                prev_x=data["prev_x"],
                prev_y=data["prev_y"],
                coverage_rad=data["coverage_rad"],
                active=data["active"],
                mounted_to=data["mounted_to"],
                floor_id=layout_id,
                state=data["state"],
                date_created=datetime(),
                date_modified=datetime()
            )
            db.session.add(device)
            message = "Device added"

        db.session.commit()
        return jsonify({"message": message}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/layouts/<layout_id>/devices/<device_id>", methods=["DELETE"])
def delete_device(layout_id, device_id):
    try:
        
        device = Device.query.filter_by(id=device_id, floor_id=layout_id).first()

        if device is None:
            return jsonify({"error": "Device not found"}), 404

        db.session.delete(device)
        db.session.commit()

        return jsonify({"message": f"Device '{device_id}' deleted from layout '{layout_id}'."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/layouts/<layout_id>/sensors', methods=['GET'])
def get_motion_sensors(layout_id):
    try:
        print(f"Fetching sensors for layout_id: {layout_id}")  # Debug print
        sensors = Sensor.query.filter_by(floor_id=layout_id, sensor_type="motion").all()

        result = []
        for sensor in sensors:
            result.append({
                "id": sensor.id,
                "sensor_type": sensor.sensor_type,
                "x": sensor.x,
                "y": sensor.y,
                "prev_x": sensor.prev_x,
                "prev_y": sensor.prev_y,
                "date_created": sensor.date_created.isoformat() if sensor.date_created else None,
                "date_modified": sensor.date_modified.isoformat() if sensor.date_modified else None,
                "room_coverage_area": sensor.room_coverage_area,
                "overlapping_sensors": sensor.overlapping_sensors,
                "connected_devices": sensor.connected_devices,
                "sensor_rad": sensor.sensor_rad,
                "mounted_to": sensor.mounted_to,
                "active": sensor.active,
                "floor_id": sensor.floor_id
            })

        print(f"Returning {len(result)} sensors")  # Debug print
        return jsonify(result), 200

    except Exception as e:
        print(f"Exception occurred: {e}")  # Debug print
        return jsonify({"error": str(e)}), 500
   
@app.route("/layouts/<layout_id>/sensors", methods=["POST"])
def add_or_update_sensor(layout_id):
    try:
        data = request.get_json()

        if not data or "id" not in data:
            return jsonify({"error": "Sensor ID is required"}), 400

        sensor = Sensor.query.get(data["id"])

        if sensor:
            # Update existing sensor
            sensor.sensor_type = data.get("sensor_type", sensor.sensor_type)
            sensor.x = data.get("x", sensor.x)
            sensor.y = data.get("y", sensor.y)
            sensor.prev_x = data.get("prev_x", sensor.prev_x)
            sensor.prev_y = data.get("prev_y", sensor.prev_y)
            sensor.room_coverage_area = data.get("room_coverage_area", sensor.room_coverage_area)
            sensor.overlapping_sensors = data.get("overlapping_sensors", sensor.overlapping_sensors)
            sensor.connected_devices = data.get("connected_devices", sensor.connected_devices)
            sensor.sensor_rad = data.get("sensor_rad", sensor.sensor_rad)
            sensor.mounted_to = data.get("mounted_to", sensor.mounted_to)
            sensor.active = data.get("active", sensor.active)
            sensor.floor_id = layout_id
        else:
            # Create new sensor
            sensor = Sensor(
                id=data["id"],
                sensor_type=data["sensor_type"],
                x=data["x"],
                y=data["y"],
                prev_x=data.get("prev_x", 0.0),
                prev_y=data.get("prev_y", 0.0),
                room_coverage_area=data["room_coverage_area"],
                overlapping_sensors=data.get("overlapping_sensors", []),
                connected_devices=data.get("connected_devices", []),
                sensor_rad=data["sensor_rad"],
                mounted_to=data["mounted_to"],
                active=data.get("active", False),
                floor_id=layout_id
            )
            db.session.add(sensor)

        db.session.commit()
        return jsonify({"message": "Sensor saved successfully"}), 200

    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({"error": str(e)}), 500



@app.route("/layouts/<layout_id>/sensors/<sensor_id>", methods=["DELETE"])
def delete_sensor(layout_id, sensor_id):
    try:
        sensor = Sensor.query.filter_by(id=sensor_id, floor_id=layout_id).first()
        
        if not sensor:
            return jsonify({"error": "Sensor not found"}), 404

        db.session.delete(sensor)
        db.session.commit()
        return jsonify({"message": f"Sensor '{sensor_id}' deleted successfully."}), 200

    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/session", methods=["POST"])
def create_session():
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    new_session = Session(name=name)
    db.session.add(new_session)
    db.session.commit()

    return jsonify(new_session.to_dict()), 201

@app.route("/session/<id>", methods=["GET"])
def get_session(id):
    session = Session.query.get(id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    return jsonify(session.to_dict()), 200

if __name__ == "__main__":    
    with app.app_context():
        create_tables()
    app.run(debug=True)