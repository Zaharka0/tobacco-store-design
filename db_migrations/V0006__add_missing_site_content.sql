-- Добавляем недостающие ключи контента
INSERT INTO site_content (content_key, content_value, section, description) VALUES
('site_name', 'Повязки для Волос', 'general', 'Название сайта в шапке')
ON CONFLICT (content_key) DO NOTHING;