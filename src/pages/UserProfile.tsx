import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

import funcUrls from '../../backend/func2url.json';

interface UserOrder {
  id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

export default function UserProfile() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const apiUrl = funcUrls['site-content'];

  const searchOrders = async () => {
    if (!phone.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders`);
      const data = await res.json();
      const userOrders = data.orders.filter((order: any) => 
        order.user_phone.includes(phone.replace(/\D/g, ''))
      );
      setOrders(userOrders);
      setSearched(true);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'processing': return 'В обработке';
      case 'completed': return 'Доставлен';
      case 'cancelled': return 'Отменён';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-accent/5">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl hover:opacity-80 transition-opacity cursor-pointer overflow-hidden">
                <img src="https://cdn.poehali.dev/files/photo_2026-01-04_20-11-08.jpg" alt="WhiteShishka Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                WhiteShishka
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Icon name="Home" size={16} className="mr-2" />
                  На главную
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Icon name="User" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Личный кабинет
              </h1>
              <p className="text-muted-foreground">История ваших заказов</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Найти мои заказы</CardTitle>
              <CardDescription>
                Введите номер телефона, который указали при оформлении заказа
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchOrders()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={searchOrders} disabled={loading || !phone.trim()}>
                    {loading ? (
                      <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                    ) : (
                      <Icon name="Search" size={16} className="mr-2" />
                    )}
                    Найти
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {searched && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold mb-2">Заказы не найдены</h3>
                    <p className="text-muted-foreground">
                      По номеру {phone} заказов не найдено
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Ваши заказы</h2>
                    <Badge variant="secondary">{orders.length}</Badge>
                  </div>

                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold">Заказ #{order.id}</span>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className="text-xl font-bold text-primary">
                            {order.total_price.toLocaleString()} ₽
                          </span>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium mb-1">{order.product_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.quantity} шт × {order.product_price.toLocaleString()} ₽
                              </p>
                            </div>
                            {order.status === 'new' && (
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Icon name="Clock" size={16} />
                                <span>Обрабатывается</span>
                              </div>
                            )}
                            {order.status === 'processing' && (
                              <div className="flex items-center gap-2 text-sm text-yellow-600">
                                <Icon name="Package" size={16} />
                                <span>Готовится к отправке</span>
                              </div>
                            )}
                            {order.status === 'completed' && (
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <Icon name="CheckCircle" size={16} />
                                <span>Доставлен</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}

          {!searched && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Введите номер телефона для поиска заказов</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="border-t border-border/50 py-8 bg-background/80">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 WhiteShishka. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}