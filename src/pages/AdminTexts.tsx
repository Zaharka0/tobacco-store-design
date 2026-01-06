import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const TEXTS_API_URL = 'https://functions.poehali.dev/310d84a8-a8a4-4b85-9dfa-a83fce97e4f8';

interface TextItem {
  value: string;
  section: string;
  description: string;
}

interface SiteTexts {
  [key: string]: TextItem;
}

export default function AdminTexts() {
  const [texts, setTexts] = useState<SiteTexts>({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadTexts();
  }, []);

  const loadTexts = async () => {
    setLoading(true);
    try {
      const response = await fetch(TEXTS_API_URL);
      if (!response.ok) throw new Error('Failed to load texts');
      const data = await response.json();
      setTexts(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Failed to load texts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: Record<string, string> = {};
      Object.entries(texts).forEach(([key, item]) => {
        updates[key] = item.value;
      });

      const response = await fetch(TEXTS_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update texts');

      toast({
        title: 'Успешно',
        description: 'Все тексты сохранены. Обновите сайт для просмотра изменений',
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

  const handleTextChange = (key: string, value: string) => {
    setTexts(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  const groupedTexts = Object.entries(texts).reduce((acc, [key, item]) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push({ key, ...item });
    return acc;
  }, {} as Record<string, Array<{ key: string } & TextItem>>);

  const filteredSections = Object.entries(groupedTexts).filter(([section, items]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return section.toLowerCase().includes(query) || 
           items.some(item => 
             item.key.toLowerCase().includes(query) || 
             item.value.toLowerCase().includes(query) ||
             item.description?.toLowerCase().includes(query)
           );
  });

  const sectionIcons: Record<string, string> = {
    navigation: 'Menu',
    hero: 'Sparkles',
    categories: 'Grid',
    catalog: 'ShoppingBag',
    system: 'Settings'
  };

  const sectionNames: Record<string, string> = {
    navigation: 'Навигация',
    hero: 'Главный экран',
    categories: 'Категории',
    catalog: 'Каталог',
    system: 'Системные'
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Type" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Редактирование текстов
              </span>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/theme">
                <Button variant="outline" size="sm">
                  <Icon name="Palette" size={16} className="mr-2" />
                  Цвета
                </Button>
              </Link>
              <Link to="/admin/content">
                <Button variant="outline" size="sm">
                  <Icon name="Layout" size={16} className="mr-2" />
                  Блоки
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
          <h1 className="text-4xl font-bold mb-2">Все тексты сайта</h1>
          <p className="text-muted-foreground">Измените любой текст на сайте: заголовки, кнопки, меню, описания</p>
        </div>

        <div className="mb-6 flex gap-4 items-center">
          <div className="flex-1 relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по текстам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSave} disabled={loading} size="lg">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить всё
          </Button>
          <Button variant="outline" onClick={loadTexts} disabled={loading} size="lg">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Отменить
          </Button>
        </div>

        <div className="space-y-6">
          {filteredSections.map(([section, items]) => (
            <Card key={section}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon name={sectionIcons[section] as any || 'FileText'} className="text-primary" size={18} />
                  </div>
                  {sectionNames[section] || section}
                </CardTitle>
                <CardDescription>
                  {items.length} {items.length === 1 ? 'элемент' : items.length < 5 ? 'элемента' : 'элементов'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map(item => (
                  <div key={item.key} className="space-y-2 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Label className="font-semibold text-base">{item.key}</Label>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">{section}</Badge>
                    </div>
                    {item.value.length > 50 ? (
                      <Textarea
                        value={item.value}
                        onChange={(e) => handleTextChange(item.key, e.target.value)}
                        rows={2}
                        className="resize-none"
                      />
                    ) : (
                      <Input
                        value={item.value}
                        onChange={(e) => handleTextChange(item.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSections.length === 0 && (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Ничего не найдено по запросу "{searchQuery}"</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
