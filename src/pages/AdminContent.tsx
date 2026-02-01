import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const CONTENT_API_URL = 'https://functions.poehali.dev/0f5283c3-17d4-488f-8881-4751a4272c14';

interface ContentBlock {
  id: number;
  page_name: string;
  block_key: string;
  block_type: string;
  content: any;
  is_visible: boolean;
  display_order: number;
}

const PAGE_NAMES = {
  home: 'Главная',
  catalog: 'Каталог',
  about: 'О магазине',
  delivery: 'Доставка',
  faq: 'FAQ'
};

export default function AdminContent() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [creatingBlock, setCreatingBlock] = useState(false);
  const [newBlock, setNewBlock] = useState({ block_key: '', block_type: 'text', content: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(CONTENT_API_URL);
      if (!response.ok) throw new Error('Failed to load content');
      const data = await response.json();
      setContentBlocks(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Failed to load content',
        variant: 'destructive',
      });
      setContentBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock({ ...block });
  };

  const handleSave = async () => {
    if (!editingBlock) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${CONTENT_API_URL}?id=${editingBlock.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editingBlock.content,
          is_visible: editingBlock.is_visible
        }),
      });

      if (!response.ok) throw new Error('Failed to update content');

      toast({
        title: 'Успешно',
        description: 'Контент обновлён',
      });

      setEditingBlock(null);
      await loadContent();
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

  const handleToggleVisibility = async (block: ContentBlock) => {
    setLoading(true);
    try {
      const response = await fetch(`${CONTENT_API_URL}?id=${block.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: block.content,
          is_visible: !block.is_visible
        }),
      });

      if (!response.ok) throw new Error('Failed to toggle visibility');

      toast({
        title: 'Успешно',
        description: block.is_visible ? 'Блок скрыт' : 'Блок показан',
      });

      await loadContent();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Failed to toggle',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlock = async () => {
    if (!newBlock.block_key || !newBlock.content) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(CONTENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_name: selectedPage,
          block_key: newBlock.block_key,
          block_type: newBlock.block_type,
          content: newBlock.content
        }),
      });

      if (!response.ok) throw new Error('Failed to create block');

      toast({
        title: 'Успешно',
        description: 'Блок создан',
      });

      setCreatingBlock(false);
      setNewBlock({ block_key: '', block_type: 'text', content: '' });
      await loadContent();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Failed to create',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const pageBlocks = contentBlocks.filter(b => b.page_name === selectedPage);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="FileText" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Управление контентом
              </span>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/theme">
                <Button variant="outline" size="sm">
                  <Icon name="Palette" size={16} className="mr-2" />
                  Цвета
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
          <h1 className="text-4xl font-bold mb-2">Редактирование контента</h1>
          <p className="text-muted-foreground">Управляйте текстами и блоками на страницах сайта</p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <Tabs value={selectedPage} onValueChange={setSelectedPage} className="flex-1">
            <TabsList className="grid w-full grid-cols-6">
              {Object.entries(PAGE_NAMES).map(([key, label]) => (
                <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button onClick={() => setCreatingBlock(true)} className="ml-4">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить блок
          </Button>
        </div>

        {creatingBlock && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Создание нового блока</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ключ блока (англ.)</Label>
                <Input
                  value={newBlock.block_key}
                  onChange={(e) => setNewBlock({ ...newBlock, block_key: e.target.value })}
                  placeholder="например: hero_title"
                />
              </div>
              <div>
                <Label>Тип блока</Label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={newBlock.block_type}
                  onChange={(e) => setNewBlock({ ...newBlock, block_type: e.target.value })}
                >
                  <option value="text">Текст</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div>
                <Label>Контент</Label>
                <Textarea
                  value={newBlock.content}
                  onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                  rows={5}
                  placeholder="Введите содержимое блока"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateBlock} disabled={loading}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать
                </Button>
                <Button variant="outline" onClick={() => {
                  setCreatingBlock(false);
                  setNewBlock({ block_key: '', block_type: 'text', content: '' });
                }}>
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {editingBlock && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Редактирование: {editingBlock.block_key}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Контент</Label>
                {typeof editingBlock.content === 'string' ? (
                  <Textarea
                    value={editingBlock.content}
                    onChange={(e) => setEditingBlock({ ...editingBlock, content: e.target.value })}
                    rows={5}
                  />
                ) : (
                  <Textarea
                    value={JSON.stringify(editingBlock.content, null, 2)}
                    onChange={(e) => {
                      try {
                        setEditingBlock({ ...editingBlock, content: JSON.parse(e.target.value) });
                      } catch {}
                    }}
                    rows={10}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingBlock.is_visible}
                  onCheckedChange={(checked) => setEditingBlock({ ...editingBlock, is_visible: checked })}
                />
                <Label>Показывать на сайте</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={loading}>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
                <Button variant="outline" onClick={() => setEditingBlock(null)}>
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {loading && pageBlocks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Загрузка...
              </CardContent>
            </Card>
          ) : pageBlocks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Нет блоков контента для этой страницы
              </CardContent>
            </Card>
          ) : (
            pageBlocks.map((block) => (
              <Card key={block.id} className={!block.is_visible ? 'opacity-50' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{block.block_key}</h3>
                        {!block.is_visible && (
                          <span className="text-xs px-2 py-1 bg-muted rounded">Скрыт</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Тип: {block.block_type}
                      </div>
                      <div className="text-sm max-h-24 overflow-hidden">
                        {typeof block.content === 'string' 
                          ? block.content 
                          : JSON.stringify(block.content, null, 2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(block)}>
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleVisibility(block)}
                      >
                        <Icon name={block.is_visible ? 'EyeOff' : 'Eye'} size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}