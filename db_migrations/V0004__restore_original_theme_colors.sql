-- Восстанавливаем оригинальные цвета дизайна
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