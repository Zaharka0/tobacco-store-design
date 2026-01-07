import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import funcUrls from '../../backend/func2url.json';

interface AnalyticsData {
  views: {
    total: number;
    unique: number;
    today: number;
    week: number;
  };
  top_pages: Array<{ page: string; views: number }>;
  orders: {
    total: number;
    new: number;
    completed: number;
    revenue: number;
  };
}

interface Order {
  id: number;
  user_name: string;
  user_phone: string;
  user_email: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  status: string;
  notes: string;
  created_at: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string;
  created_at: string;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'notifications'>('stats');

  const apiUrl = funcUrls['site-content'];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const res = await fetch(`${apiUrl}/analytics-stats`);
        const data = await res.json();
        setAnalytics(data);
      } else if (activeTab === 'orders') {
        const res = await fetch(`${apiUrl}/orders`);
        const data = await res.json();
        setOrders(data.orders);
      } else if (activeTab === 'notifications') {
        const res = await fetch(`${apiUrl}/notifications`);
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await fetch(`${apiUrl}/order-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      loadData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const markNotificationRead = async (notifId: number) => {
    try {
      await fetch(`${apiUrl}/notification-read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notifId })
      });
      loadData();
    } catch (error) {
      console.error('Error marking notification:', error);
    }
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
      case 'processing': return 'В работе';
      case 'completed': return 'Выполнен';
      case 'cancelled': return 'Отменён';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Icon name="BarChart3" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Аналитика и заказы
              </h1>
              <p className="text-muted-foreground">Статистика посещений и управление заказами</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/admin'}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}
          >
            <Icon name="BarChart3" size={16} className="mr-2" />
            Статистика
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            <Icon name="ShoppingBag" size={16} className="mr-2" />
            Заказы
          </Button>
          <Button
            variant={activeTab === 'notifications' ? 'default' : 'outline'}
            onClick={() => setActiveTab('notifications')}
          >
            <Icon name="Bell" size={16} className="mr-2" />
            Уведомления
            {notifications?.filter(n => !n.is_read).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.filter(n => !n.is_read).length}
              </Badge>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <>
            {activeTab === 'stats' && analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Всего просмотров
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.views?.total || 0}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Уникальных: {analytics.views?.unique || 0}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        За сегодня
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.views?.today || 0}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        За неделю
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.views?.week || 0}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Выручка
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{(analytics.orders?.revenue || 0).toLocaleString()} ₽</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Заказов: {analytics.orders?.completed || 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Популярные страницы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.top_pages?.map((page, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{page.page}</span>
                            <Badge variant="secondary">{page.views}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Статистика заказов</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Всего заказов</span>
                          <span className="font-bold">{analytics.orders?.total || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Новые</span>
                          <Badge className="bg-blue-500">{analytics.orders?.new || 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Выполнено</span>
                          <Badge className="bg-green-500">{analytics.orders?.completed || 0}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Список заказов</CardTitle>
                  <CardDescription>Управление заказами клиентов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold">Заказ #{order.id}</span>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleString('ru-RU')}
                            </p>
                          </div>
                          <span className="text-lg font-bold">{order.total_price.toLocaleString()} ₽</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Клиент</p>
                            <p className="font-medium">{order.user_name}</p>
                            <p className="text-sm">{order.user_phone}</p>
                            {order.user_email && <p className="text-sm">{order.user_email}</p>}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Товар</p>
                            <p className="font-medium">{order.product_name}</p>
                            <p className="text-sm">
                              {order.quantity} шт × {order.product_price.toLocaleString()} ₽
                            </p>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mb-3">
                            <p className="text-sm text-muted-foreground">Примечания</p>
                            <p className="text-sm">{order.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {order.status === 'new' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'processing')}
                            >
                              В работу
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              Выполнен
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            Отменить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Уведомления</CardTitle>
                  <CardDescription>История событий и уведомлений</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border rounded-lg ${!notif.is_read ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon
                                name={notif.type === 'order' ? 'ShoppingBag' : 'Bell'}
                                size={16}
                                className="text-primary"
                              />
                              <span className="font-bold">{notif.title}</span>
                              {!notif.is_read && <Badge variant="default">Новое</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{notif.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(notif.created_at).toLocaleString('ru-RU')}
                            </p>
                          </div>
                          {!notif.is_read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markNotificationRead(notif.id)}
                            >
                              <Icon name="Check" size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}