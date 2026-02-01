import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import funcUrls from '../../backend/func2url.json';

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount: string;
  image_url: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    image_url: '/placeholder.svg',
    valid_until: '',
    is_active: true
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();
  const API_URL = funcUrls['promotions'] || funcUrls['site-content'];

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      if (!API_URL) {
        toast({
          title: 'Ошибка',
          description: 'Backend функция не настроена',
          variant: 'destructive'
        });
        setPromotions([]);
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}?action=promotions`);
      if (!res.ok) throw new Error('Failed to load promotions');
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast({
          title: 'Backend не готов',
          description: 'Функция акций ещё не развёрнута',
          variant: 'destructive'
        });
        setPromotions([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPromotions(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить акции',
        variant: 'destructive'
      });
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `${API_URL}?action=promotions&id=${editingId}` : `${API_URL}?action=promotions`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save promotion');

      toast({
        title: 'Успешно',
        description: `Акция ${editingId ? 'обновлена' : 'добавлена'}`
      });

      setFormData({
        title: '',
        description: '',
        discount: '',
        image_url: '/placeholder.svg',
        valid_until: '',
        is_active: true
      });
      setEditingId(null);
      await loadPromotions();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Операция не удалась',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promo: Promotion) => {
    setFormData({
      title: promo.title,
      description: promo.description,
      discount: promo.discount,
      image_url: promo.image_url,
      valid_until: promo.valid_until,
      is_active: promo.is_active
    });
    setEditingId(promo.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту акцию?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=promotions&id=${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast({
        title: 'Успешно',
        description: 'Акция удалена'
      });

      await loadPromotions();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить акцию',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <Icon name="ArrowLeft" size={20} />
              <span className="font-bold">Назад в админку</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Управление акциями</h1>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название акции</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Скидка</label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="-20%"
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Действует до</label>
                  <input
                    type="text"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    placeholder="31.12.2026"
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL изображения</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium">Активна</label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {editingId ? 'Обновить' : 'Добавить'} акцию
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        title: '',
                        description: '',
                        discount: '',
                        image_url: '/placeholder.svg',
                        valid_until: '',
                        is_active: true
                      });
                    }}
                  >
                    Отмена
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {loading && <p>Загрузка...</p>}
          {promotions.map((promo) => (
            <Card key={promo.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={promo.image_url}
                    alt={promo.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                    <p className="text-muted-foreground mb-2">{promo.description}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                      <span>Скидка: {promo.discount}</span>
                      <span>До: {promo.valid_until}</span>
                      <span>{promo.is_active ? '✅ Активна' : '❌ Неактивна'}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(promo)}
                      >
                        <Icon name="Edit" size={16} className="mr-1" />
                        Редактировать
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(promo.id)}
                      >
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}