-- Создание таблицы для настроек телеграм-бота
CREATE TABLE IF NOT EXISTS bot_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для шаблонов сообщений бота
CREATE TABLE IF NOT EXISTS bot_messages (
  id SERIAL PRIMARY KEY,
  message_key VARCHAR(255) UNIQUE NOT NULL,
  message_text TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка базовых настроек
INSERT INTO bot_settings (setting_key, setting_value, description) VALUES
('bot_token', '', 'Токен телеграм-бота от @BotFather'),
('bot_enabled', 'false', 'Включить/выключить бота'),
('admin_chat_id', '', 'ID чата для уведомлений администратора'),
('welcome_enabled', 'true', 'Включить приветственное сообщение')
ON CONFLICT (setting_key) DO NOTHING;

-- Вставка базовых шаблонов сообщений
INSERT INTO bot_messages (message_key, message_text, description) VALUES
('welcome', 'Привет! 👋 Добро пожаловать в магазин WhiteShishka!', 'Приветственное сообщение'),
('help', 'Доступные команды:\n/start - Начать\n/catalog - Каталог\n/help - Помощь', 'Сообщение помощи'),
('catalog_intro', '📦 Наш каталог продукции:', 'Введение к каталогу')
ON CONFLICT (message_key) DO NOTHING;