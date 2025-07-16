# quick_test.py
from flask import Flask
from models import db, Device

app = Flask(__name__)

# 使用 SQLite 本地文件 smart.db
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///smart.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    # 如果表不存在就创建
    db.create_all()

    # 插入一条测试数据（已存在就跳过）
    if not Device.query.get("light_living"):
        db.session.add(Device(id="light_living", type="light", state={"on": False}))
        db.session.commit()

    # 查询并打印所有设备
    all_devices = Device.query.all()
    print("\n当前 Device 表内容：")
    for dev in all_devices:
        print(dev)

print("\n✅ quick_test.py 运行完毕，smart.db 已生成/更新。")
