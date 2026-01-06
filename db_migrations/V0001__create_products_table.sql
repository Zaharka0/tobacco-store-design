-- Создание таблицы товаров с полными описаниями
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    short_description TEXT,
    full_description TEXT,
    features JSONB,
    in_stock BOOLEAN DEFAULT true,
    is_new BOOLEAN DEFAULT false,
    discount INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_is_new ON products(is_new);

-- Вставка примеров товаров
INSERT INTO products (name, price, category, image_url, short_description, full_description, features, in_stock, is_new, discount) VALUES
('HQD Cuvie Plus', 650, 'Одноразовые', '/placeholder.svg', 
 'Компактный одноразовый под на 1200 затяжек', 
 'HQD Cuvie Plus - это стильный и удобный одноразовый под, который идеально подходит для тех, кто ценит комфорт и качество. Устройство не требует обслуживания, заправки или зарядки - просто распакуйте и наслаждайтесь.', 
 '{"battery": "850 мАч", "puffs": "1200 затяжек", "nicotine": "20 мг/мл", "volume": "5 мл", "flavors": "25+ вкусов"}',
 true, false, 0),

('JUUL Starter Kit', 2450, 'Под-системы', '/placeholder.svg',
 'Культовая под-система с уникальной технологией испарения',
 'JUUL - это революция в мире вейпинга. Запатентованная технология JUULsalts обеспечивает максимально плавную передачу никотина, идентичную традиционным сигаретам. Элегантный дизайн, надежная конструкция и простота использования делают JUUL выбором миллионов пользователей по всему миру.',
 '{"battery": "200 мАч", "charging": "USB-C магнитная", "pods": "4 капсулы в комплекте", "nicotine": "18-59 мг/мл", "device_size": "9.5 x 1.5 см"}',
 true, false, 15),

('Elf Bar BC5000', 850, 'Одноразовые', '/placeholder.svg',
 'Премиальный одноразовый под на 5000 затяжек',
 'Elf Bar BC5000 представляет собой топовую модель одноразовых устройств с невероятным запасом автономности. Эргономичный корпус удобно ложится в руку, а яркие насыщенные вкусы не оставят равнодушным даже самого требовательного пользователя. Встроенная батарея на 650 мАч обеспечивает стабильную работу до последней затяжки.',
 '{"battery": "650 мАч", "puffs": "5000 затяжек", "nicotine": "50 мг/мл", "volume": "13 мл", "rechargeable": "Type-C"}',
 true, true, 0),

('VAPORESSO XROS 3', 1890, 'Под-системы', '/placeholder.svg',
 'Инновационная под-система с регулируемой мощностью',
 'VAPORESSO XROS 3 - это флагманская модель с передовыми технологиями. Регулируемая мощность от 5 до 25 Вт позволяет настроить парение под свои предпочтения. COREX Heating Technology обеспечивает на 50% больше вкуса и увеличенный срок службы испарителей. Батарея на 1000 мАч и быстрая зарядка Type-C делают устройство идеальным для ежедневного использования.',
 '{"battery": "1000 мАч", "power": "5-25 Вт", "pods": "2 мл (0.6Ω/0.8Ω/1.0Ω)", "display": "0.42\" OLED", "charging": "Type-C 1A"}',
 true, true, 10);
