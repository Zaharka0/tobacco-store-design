-- Создание таблицы для подписчиков рассылки
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по email
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Индекс для фильтрации активных подписчиков
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(active);
