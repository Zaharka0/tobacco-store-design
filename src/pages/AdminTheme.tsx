import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const THEME_API_URL = 'https://functions.poehali.dev/ede28564-2e57-4545-aebb-ff117c81a6f4';

interface ThemeColors {
  [key: string]: string;
}

const COLOR_DESCRIPTIONS: Record<string, string> = {
  primary: 'Основной цвет (кнопки, акценты)',
  'primary-foreground': 'Текст на основном цвете',
  accent: 'Акцентный цвет (ссылки, выделения)',
  background: 'Фон страницы',
  foreground: 'Основной цвет текста',
  card: 'Фон карточек',
  'card-foreground': 'Текст на карточках',
  muted: 'Приглушённый фон',
  'muted-foreground': 'Приглушённый текст',
  border: 'Цвет границ',
  input: 'Фон полей ввода',
  ring: 'Цвет фокуса'
};

export default function AdminTheme() {
  const [colors, setColors] = useState<ThemeColors>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    setLoading(true);
    try {
      const response = await fetch(THEME_API_URL);
      if (!response.ok) throw new Error('Failed to load theme');
      const data = await response.json();
      setColors(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Failed to load theme',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(THEME_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colors),
      });

      if (!response.ok) throw new Error('Failed to update theme');

      toast({
        title: 'Успешно',
        description: 'Цвета обновлены. Обновите страницу, чтобы увидеть изменения',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Failed to update',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const rgbToHex = (rgb: string): string => {
    const parts = rgb.split(' ').map(Number);
    if (parts.length !== 3) return '#000000';
    return '#' + parts.map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0 0';
    return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Palette" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Управление цветами
              </span>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/content">
                <Button variant="outline" size="sm">
                  <Icon name="FileText" size={16} className="mr-2" />
                  Контент
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Icon name="Package" size={16} className="mr-2" />
                  Товары
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                <Icon name="Home" size={16} className="mr-2" />
                На сайт
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Настройка цветов сайта</h1>
          <p className="text-muted-foreground">Измените цветовую схему вашего магазина</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Цветовая палитра</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label className="font-semibold">{key}</Label>
                  <p className="text-xs text-muted-foreground">{COLOR_DESCRIPTIONS[key] || 'Цвет'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={rgbToHex(value)}
                    onChange={(e) => setColors({ ...colors, [key]: hexToRgb(e.target.value) })}
                    className="w-20 h-10"
                  />
                  <div 
                    className="w-20 h-10 rounded border border-border"
                    style={{ backgroundColor: `rgb(${value})` }}
                  />
                </div>
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  placeholder="R G B (например: 139 92 246)"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={loading} size="lg">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить изменения
          </Button>
          <Button variant="outline" onClick={loadTheme} disabled={loading} size="lg">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
}
