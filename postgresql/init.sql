CREATE TABLE IF NOT EXISTS post (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO post (title, username, text) VALUES
('はじめての投稿', 'taro', 'これは最初の投稿です！'),
('こんにちは世界', 'hanako', 'ReactとFastAPIで掲示板アプリを作っています。'),
('質問があります', 'satoshi', 'FastAPIでCORSの設定がうまくいきません。誰か助けて！');
