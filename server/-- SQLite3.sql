-- SQLite
INSERT INTO sensor (
    id,
    sensor_type,
    x,
    y,
    prev_x,
    prev_y,
    date_created,
    date_modified,
    room_coverage_area,
    overlapping_sensors,
    connected_devices,
    sensor_rad,
    mounted_to,
    active,
    floor_id
)
VALUES (
    'sensor-001',
    'motion',
    100,
    200,
    90,
    190,
    datetime('now'),
    datetime('now'),
    'Room A',
    'sensor-002,sensor-003',
    'device-001,device-002',
    15.0,
    'wall',
    1,
    'floor-1-asdf'
);
