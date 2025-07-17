from flask import Flask
from models import db, Device
import os, pathlib

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///smart.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    # 先确保完全重建
    db.drop_all()
    db.create_all()

    # 插入两条示例数据
    devices = [
        Device(id="light_living", type="light", state={"on": False}),
        Device(id="door_front",  type="door",  state={"locked": True})
    ]
    db.session.bulk_save_objects(devices)
    db.session.commit()

print("完成建表并插入数据，文件位置：", pathlib.Path("smart.db").resolve())
