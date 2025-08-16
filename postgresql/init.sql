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

INSERT INTO locations (ip_address, latitude, longitude, accuracy, scheduled_end_at) VALUES
('192.168.0.10', 35.6812, 139.7671, 15.0, '2025-08-17 12:00:00+09'), -- 東京駅
('192.168.0.10', 34.7025, 135.4959, 15.0, '2025-08-17 12:00:00+09'), -- 大阪駅
('192.168.0.10', 35.1709, 136.8815, 15.0, '2025-08-17 12:00:00+09'), -- 名古屋駅
('192.168.0.10', 43.0687, 141.3508, 15.0, '2025-08-17 12:00:00+09'), -- 札幌駅
('192.168.0.10', 33.5902, 130.4017, 15.0, '2025-08-17 12:00:00+09'), -- 博多駅
('192.168.0.10', 34.3853, 132.4553, 15.0, '2025-08-17 12:00:00+09'), -- 広島市中心
('192.168.0.10', 26.2125, 127.6811, 15.0, '2025-08-17 12:00:00+09'), -- 那覇市
('192.168.0.10', 38.2688, 140.8719, 15.0, '2025-08-17 12:00:00+09'), -- 仙台駅
('192.168.0.10', 36.3418, 140.4468, 15.0, '2025-08-17 12:00:00+09'), -- 水戸市
('192.168.0.10', 34.6913, 135.1830, 15.0, '2025-08-17 12:00:00+09'); -- 神戸市

INSERT INTO comments (ip_address, comment)
VALUES ('192.168.0.11', '初めてのコメント！');
