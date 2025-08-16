DROP TABLE IF EXISTS locations CASCADE;
CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    ip_address INET NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    scheduled_end_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS comments CASCADE;
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    ip_address INET NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO locations (ip_address, latitude, longitude, accuracy, scheduled_end_at)
VALUES ('192.168.0.10', 35.6812, 139.7671, 15.0, '2025-08-17 12:00:00+09');

INSERT INTO comments (ip_address, comment)
VALUES ('192.168.0.11', '初めてのコメント！');
