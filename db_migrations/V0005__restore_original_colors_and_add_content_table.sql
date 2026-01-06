-- Восстанавливаем оригинальные цвета сайта
UPDATE site_theme SET color_value = '14 15 15' WHERE theme_key = 'background';
UPDATE site_theme SET color_value = '250 250 250' WHERE theme_key = 'foreground';
UPDATE site_theme SET color_value = '25 26 26' WHERE theme_key = 'card';
UPDATE site_theme SET color_value = '250 250 250' WHERE theme_key = 'card-foreground';
UPDATE site_theme SET color_value = '139 92 246' WHERE theme_key = 'primary';
UPDATE site_theme SET color_value = '255 255 255' WHERE theme_key = 'primary-foreground';
UPDATE site_theme SET color_value = '246 178 192' WHERE theme_key = 'accent';
UPDATE site_theme SET color_value = '14 15 15' WHERE theme_key = 'accent-foreground';
UPDATE site_theme SET color_value = '46 46 46' WHERE theme_key = 'muted';
UPDATE site_theme SET color_value = '166 166 166' WHERE theme_key = 'muted-foreground';
UPDATE site_theme SET color_value = '46 46 46' WHERE theme_key = 'border';
UPDATE site_theme SET color_value = '46 46 46' WHERE theme_key = 'input';
UPDATE site_theme SET color_value = '139 92 246' WHERE theme_key = 'ring';

-- Создаём таблицу для хранения контента сайта
CREATE TABLE IF NOT EXISTS site_content (
  content_key VARCHAR(100) PRIMARY KEY,
  content_value TEXT NOT NULL,
  section VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Заполняем таблицу оригинальным контентом
INSERT INTO site_content (content_key, content_value, section, description) VALUES
-- Hero секция
('hero_title', 'Стильные Повязки для Волос', 'hero', 'Главный заголовок на главной странице'),
('hero_subtitle', 'Уникальные аксессуары ручной работы для создания неповторимого образа', 'hero', 'Подзаголовок героя'),
('hero_button_catalog', 'Смотреть каталог', 'hero', 'Текст кнопки каталога'),
('hero_button_about', 'О нас', 'hero', 'Текст кнопки "О нас"'),

-- Преимущества
('feature1_title', 'Ручная работа', 'features', 'Заголовок первого преимущества'),
('feature1_description', 'Каждая повязка изготовлена вручную с особым вниманием к деталям', 'features', 'Описание первого преимущества'),
('feature2_title', 'Натуральные материалы', 'features', 'Заголовок второго преимущества'),
('feature2_description', 'Используем только качественные и безопасные ткани', 'features', 'Описание второго преимущества'),
('feature3_title', 'Уникальный дизайн', 'features', 'Заголовок третьего преимущества'),
('feature3_description', 'Эксклюзивные узоры и стили для вашего образа', 'features', 'Описание третьего преимущества'),

-- Популярные товары
('popular_title', 'Популярные товары', 'catalog', 'Заголовок секции популярных товаров'),
('popular_button', 'Посмотреть все товары', 'catalog', 'Кнопка просмотра всех товаров'),

-- О нас
('about_title', 'О нашем бренде', 'about', 'Заголовок секции "О нас"'),
('about_description', 'Мы создаём уникальные аксессуары для волос, которые подчёркивают индивидуальность каждой девушки. Наша миссия — сделать каждый день особенным с помощью стильных и качественных повязок ручной работы.', 'about', 'Описание бренда'),

-- Контакты
('contact_title', 'Связаться с нами', 'contact', 'Заголовок секции контактов'),
('contact_email_label', 'Email', 'contact', 'Метка поля Email'),
('contact_name_label', 'Имя', 'contact', 'Метка поля Имя'),
('contact_message_label', 'Сообщение', 'contact', 'Метка поля Сообщение'),
('contact_button', 'Отправить сообщение', 'contact', 'Текст кнопки отправки'),

-- Футер
('footer_description', 'Стильные повязки для волос ручной работы', 'footer', 'Описание в футере'),
('footer_copyright', '© 2024 Повязки для Волос. Все права защищены.', 'footer', 'Копирайт'),

-- Навигация
('nav_home', 'Главная', 'navigation', 'Ссылка на главную'),
('nav_catalog', 'Каталог', 'navigation', 'Ссылка на каталог'),
('nav_about', 'О нас', 'navigation', 'Ссылка на "О нас"'),
('nav_contact', 'Контакты', 'navigation', 'Ссылка на контакты'),
('nav_cart', 'Корзина', 'navigation', 'Ссылка на корзину')
ON CONFLICT (content_key) DO NOTHING;