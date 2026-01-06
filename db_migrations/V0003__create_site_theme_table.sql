-- Create table for storing site theme colors
CREATE TABLE IF NOT EXISTS site_theme (
    id SERIAL PRIMARY KEY,
    theme_key VARCHAR(50) NOT NULL UNIQUE,
    color_value VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_site_theme_key ON site_theme(theme_key);

-- Insert default theme colors
INSERT INTO site_theme (theme_key, color_value, description) VALUES
('primary', '139 92 246', 'Основной цвет (фиолетовый)'),
('primary-foreground', '255 255 255', 'Текст на основном цвете'),
('accent', '236 72 153', 'Акцентный цвет (розовый)'),
('background', '0 0 0', 'Фон страницы'),
('foreground', '255 255 255', 'Основной цвет текста'),
('card', '10 10 10', 'Фон карточек'),
('card-foreground', '255 255 255', 'Текст на карточках'),
('muted', '38 38 38', 'Приглушённый фон'),
('muted-foreground', '163 163 163', 'Приглушённый текст'),
('border', '38 38 38', 'Цвет границ'),
('input', '38 38 38', 'Фон полей ввода'),
('ring', '139 92 246', 'Цвет фокуса')
ON CONFLICT (theme_key) DO NOTHING;

COMMENT ON TABLE site_theme IS 'Цветовая схема сайта';
COMMENT ON COLUMN site_theme.theme_key IS 'Ключ цвета (primary, accent и т.д.)';
COMMENT ON COLUMN site_theme.color_value IS 'Значение цвета в формате RGB (например: 139 92 246)';
