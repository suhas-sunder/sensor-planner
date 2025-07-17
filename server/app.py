# app.py

from flask import Flask, request, jsonify
from models import db, Device 
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
            device.date_modified = datetime.utcnow()
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
                date_created=datetime.utcnow(),
                date_modified=datetime.utcnow()
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


if __name__ == "__main__":    
    with app.app_context():
        create_tables()
    app.run(debug=True)
