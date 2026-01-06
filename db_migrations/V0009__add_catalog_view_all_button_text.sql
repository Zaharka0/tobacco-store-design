-- Добавляем недостающий текст кнопки
INSERT INTO site_texts (text_key, text_value, section, description) VALUES
('catalog_view_all_button', 'Смотреть весь каталог', 'catalog', 'Кнопка просмотра всего каталога')
ON CONFLICT (text_key) DO NOTHING;