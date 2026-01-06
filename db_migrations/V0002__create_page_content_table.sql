-- Create table for storing page content blocks
CREATE TABLE IF NOT EXISTS page_content (
    id SERIAL PRIMARY KEY,
    page_name VARCHAR(100) NOT NULL,
    block_key VARCHAR(100) NOT NULL,
    block_type VARCHAR(50) NOT NULL,
    content_text TEXT,
    content_json JSONB,
    is_visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page_name, block_key)
);

CREATE INDEX idx_page_content_page ON page_content(page_name);
CREATE INDEX idx_page_content_visible ON page_content(is_visible);

-- Insert default content for main page
INSERT INTO page_content (page_name, block_key, block_type, content_text, content_json, display_order) VALUES
('home', 'hero_title', 'text', 'Премиум Вейп-Магазин', NULL, 1),
('home', 'hero_subtitle', 'text', 'Широкий выбор под систем, жидкостей и аксессуаров от проверенных производителей', NULL, 2),
('home', 'hero_badge', 'text', '18+', NULL, 0),
('home', 'categories', 'json', NULL, '{"items": [{"icon": "Cigarette", "title": "Одноразки", "desc": "Удобно и просто"}, {"icon": "Droplets", "title": "Жидкости", "desc": "Все вкусы"}, {"icon": "Puzzle", "title": "Аксессуары", "desc": "Для всех моделей"}]}', 3),
('home', 'catalog_title', 'text', 'Каталог товаров', NULL, 4),
('home', 'catalog_subtitle', 'text', 'Выберите категорию и фильтры для удобного поиска', NULL, 5),
('catalog', 'page_title', 'text', 'Каталог товаров', NULL, 1),
('catalog', 'page_subtitle', 'text', 'Широкий ассортимент устройств, жидкостей и аксессуаров', NULL, 2),
('about', 'page_title', 'text', 'О нашем магазине', NULL, 1),
('about', 'page_content', 'text', 'WhiteShishka - ваш надежный партнер в мире вейпинга', NULL, 2),
('delivery', 'page_title', 'text', 'Доставка и оплата', NULL, 1),
('promotions', 'page_title', 'text', 'Акции и специальные предложения', NULL, 1),
('faq', 'page_title', 'text', 'Часто задаваемые вопросы', NULL, 1);

COMMENT ON TABLE page_content IS 'Хранение редактируемого контента страниц';
COMMENT ON COLUMN page_content.page_name IS 'Название страницы (home, catalog, about и т.д.)';
COMMENT ON COLUMN page_content.block_key IS 'Уникальный ключ блока на странице';
COMMENT ON COLUMN page_content.block_type IS 'Тип блока: text, json, image';
COMMENT ON COLUMN page_content.is_visible IS 'Видимость блока на странице';
