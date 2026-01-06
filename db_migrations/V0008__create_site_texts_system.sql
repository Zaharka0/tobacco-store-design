-- Создаём таблицу для хранения всех текстов сайта
CREATE TABLE IF NOT EXISTS site_texts (
  text_key VARCHAR(100) PRIMARY KEY,
  text_value TEXT NOT NULL,
  section VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Заполняем все тексты с главной страницы
INSERT INTO site_texts (text_key, text_value, section, description) VALUES
-- Навигация
('site_name', 'WhiteShishka', 'navigation', 'Название сайта в шапке'),
('nav_home', 'Главная', 'navigation', 'Ссылка Главная'),
('nav_catalog', 'Каталог', 'navigation', 'Ссылка Каталог'),
('nav_about', 'О магазине', 'navigation', 'Ссылка О магазине'),
('nav_delivery', 'Доставка', 'navigation', 'Ссылка Доставка'),
('nav_promotions', 'Акции', 'navigation', 'Ссылка Акции'),
('nav_faq', 'FAQ', 'navigation', 'Ссылка FAQ'),
('nav_online_label', 'онлайн', 'navigation', 'Метка онлайн пользователей'),
('nav_bot_button', 'Написать в бот', 'navigation', 'Кнопка бота в шапке'),

-- Hero секция
('hero_badge', '18+', 'hero', 'Бейдж возрастного ограничения'),
('hero_title', 'Премиум Вейп-Магазин', 'hero', 'Главный заголовок'),
('hero_subtitle', 'Широкий выбор под систем, жидкостей и аксессуаров от проверенных производителей', 'hero', 'Подзаголовок'),
('hero_catalog_button', 'Смотреть каталог', 'hero', 'Кнопка каталога'),
('hero_promotions_button', 'Акции', 'hero', 'Кнопка акций'),

-- Категории
('cat1_title', 'Одноразки', 'categories', 'Название категории 1'),
('cat1_desc', 'Удобно и просто', 'categories', 'Описание категории 1'),
('cat2_title', 'Жидкости', 'categories', 'Название категории 2'),
('cat2_desc', 'Все вкусы', 'categories', 'Описание категории 2'),
('cat3_title', 'Аксессуары', 'categories', 'Название категории 3'),
('cat3_desc', 'Для всех моделей', 'categories', 'Описание категории 3'),

-- Каталог
('catalog_title', 'Каталог товаров', 'catalog', 'Заголовок каталога'),
('catalog_subtitle', 'Выберите категорию и фильтры для удобного поиска', 'catalog', 'Подзаголовок каталога'),
('catalog_filter_category', 'Категория', 'catalog', 'Метка фильтра категорий'),
('catalog_filter_price', 'Цена', 'catalog', 'Метка фильтра цены'),
('catalog_tab_all', 'Все', 'catalog', 'Вкладка Все'),
('catalog_tab_disposable', 'Одноразки', 'catalog', 'Вкладка Одноразки'),
('catalog_tab_liquids', 'Жидкости', 'catalog', 'Вкладка Жидкости'),
('catalog_tab_accessories', 'Аксессуары', 'catalog', 'Вкладка Аксессуары'),
('catalog_price_all', 'Все', 'catalog', 'Цена: Все'),
('catalog_price_low', 'До 1000₽', 'catalog', 'Цена: До 1000₽'),
('catalog_price_mid', '1000-3000₽', 'catalog', 'Цена: 1000-3000₽'),
('catalog_price_high', 'От 3000₽', 'catalog', 'Цена: От 3000₽'),
('catalog_badge_new', 'Новинка', 'catalog', 'Бейдж Новинка'),
('catalog_in_stock', 'В наличии', 'catalog', 'Метка В наличии'),
('catalog_out_of_stock', 'Нет в наличии', 'catalog', 'Метка Нет в наличии'),
('catalog_view_button', 'Подробнее', 'catalog', 'Кнопка Подробнее'),

-- Загрузка и ошибки
('loading_text', 'Загрузка...', 'system', 'Текст загрузки'),
('error_load_failed', 'Не удалось загрузить товары', 'system', 'Ошибка загрузки'),
('error_retry_button', 'Попробовать снова', 'system', 'Кнопка повтора')
ON CONFLICT (text_key) DO NOTHING;