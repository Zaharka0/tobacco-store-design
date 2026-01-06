import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: 'pods' | 'liquids' | 'accessories';
  flavor?: string;
  image: string;
  badge?: string;
}

const initialProducts: Product[] = [
  { id: 1, name: 'JUUL Pod System', price: 3500, category: 'pods', image: '/placeholder.svg', badge: 'ХИТ' },
  { id: 2, name: 'SMOK Nord 4', price: 2800, category: 'pods', image: '/placeholder.svg' },
  { id: 3, name: 'Vaporesso XROS 3', price: 2200, category: 'pods', image: '/placeholder.svg', badge: 'НОВИНКА' },
  { id: 4, name: 'Жидкость Ягодный Микс', price: 450, category: 'liquids', flavor: 'berry', image: '/placeholder.svg' },
  { id: 5, name: 'Жидкость Тропик', price: 500, category: 'liquids', flavor: 'tropical', image: '/placeholder.svg', badge: 'ТОП' },
  { id: 6, name: 'Жидкость Мята', price: 420, category: 'liquids', flavor: 'mint', image: '/placeholder.svg' },
  { id: 7, name: 'USB-C Кабель', price: 350, category: 'accessories', image: '/placeholder.svg' },
  { id: 8, name: 'Сменные картриджи', price: 800, category: 'accessories', image: '/placeholder.svg' },
];

export default function Admin() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'pods',
    image: '/placeholder.svg',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 50) + 10);
    }, 5000);
    setOnlineUsers(Math.floor(Math.random() * 50) + 10);
    return () => clearInterval(interval);
  }, []);

  const handleAddProduct = () => {
    const product: Product = {
      id: products.length + 1,
      name: newProduct.name || '',
      price: newProduct.price || 0,
      category: newProduct.category as 'pods' | 'liquids' | 'accessories',
      flavor: newProduct.flavor,
      image: newProduct.image || '/placeholder.svg',
      badge: newProduct.badge,
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: 0, category: 'pods', image: '/placeholder.svg' });
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const stats = [
    { label: 'Всего товаров', value: products.length, icon: 'Package', color: 'text-primary' },
    { label: 'Под системы', value: products.filter(p => p.category === 'pods').length, icon: 'Box', color: 'text-blue-500' },
    { label: 'Жидкости', value: products.filter(p => p.category === 'liquids').length, icon: 'Droplets', color: 'text-cyan-500' },
    { label: 'Аксессуары', value: products.filter(p => p.category === 'accessories').length, icon: 'Puzzle', color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Админ панель
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-border/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Онлайн:</span>
                <Badge className="bg-primary/20 text-primary border-primary/50">{onlineUsers}</Badge>
              </div>
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
          <h1 className="text-4xl font-bold mb-2">Панель управления</h1>
          <p className="text-muted-foreground">Управление товарами и контентом магазина</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-border/50 bg-card/80 backdrop-blur hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center ${stat.color}`}>
                    <Icon name={stat.icon as any} size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Товары</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Добавить новый товар</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Название</Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Название товара"
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div>
                      <Label>Цена (₽)</Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        placeholder="0"
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div>
                      <Label>Категория</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value as any })}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pods">Под системы</SelectItem>
                          <SelectItem value="liquids">Жидкости</SelectItem>
                          <SelectItem value="accessories">Аксессуары</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newProduct.category === 'liquids' && (
                      <div>
                        <Label>Вкус</Label>
                        <Select
                          value={newProduct.flavor}
                          onValueChange={(value) => setNewProduct({ ...newProduct, flavor: value })}
                        >
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Выберите вкус" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="berry">Ягоды</SelectItem>
                            <SelectItem value="tropical">Тропик</SelectItem>
                            <SelectItem value="mint">Мята</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label>Бейдж (необязательно)</Label>
                      <Input
                        value={newProduct.badge || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                        placeholder="ХИТ, НОВИНКА, ТОП"
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div>
                      <Label>URL изображения</Label>
                      <Input
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        placeholder="/placeholder.svg"
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <Button onClick={handleAddProduct} className="w-full bg-primary hover:bg-primary/90">
                      Добавить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card/50 mb-6">
                <TabsTrigger value="all">Все ({products.length})</TabsTrigger>
                <TabsTrigger value="pods">Под системы ({products.filter(p => p.category === 'pods').length})</TabsTrigger>
                <TabsTrigger value="liquids">Жидкости ({products.filter(p => p.category === 'liquids').length})</TabsTrigger>
                <TabsTrigger value="accessories">Аксессуары ({products.filter(p => p.category === 'accessories').length})</TabsTrigger>
              </TabsList>

              {['all', 'pods', 'liquids', 'accessories'].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="space-y-3">
                    {products
                      .filter(p => tab === 'all' || p.category === tab)
                      .map((product) => (
                        <Card key={product.id} className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{product.name}</h3>
                                  {product.badge && (
                                    <Badge className="bg-accent text-accent-foreground text-xs">{product.badge}</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="font-bold text-primary text-base">{product.price}₽</span>
                                  <Badge variant="outline" className="capitalize">
                                    {product.category === 'pods' ? 'Под системы' : 
                                     product.category === 'liquids' ? 'Жидкости' : 'Аксессуары'}
                                  </Badge>
                                  {product.flavor && (
                                    <span className="text-xs">
                                      {product.flavor === 'berry' ? '🍓 Ягоды' : 
                                       product.flavor === 'tropical' ? '🥥 Тропик' : '🌿 Мята'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingProduct(product)}
                                    >
                                      <Icon name="Pencil" size={16} />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-card border-border/50">
                                    <DialogHeader>
                                      <DialogTitle>Редактировать товар</DialogTitle>
                                    </DialogHeader>
                                    {editingProduct && (
                                      <div className="space-y-4">
                                        <div>
                                          <Label>Название</Label>
                                          <Input
                                            value={editingProduct.name}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                            className="bg-background/50 border-border/50"
                                          />
                                        </div>
                                        <div>
                                          <Label>Цена (₽)</Label>
                                          <Input
                                            type="number"
                                            value={editingProduct.price}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                            className="bg-background/50 border-border/50"
                                          />
                                        </div>
                                        <div>
                                          <Label>Категория</Label>
                                          <Select
                                            value={editingProduct.category}
                                            onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value as any })}
                                          >
                                            <SelectTrigger className="bg-background/50 border-border/50">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pods">Под системы</SelectItem>
                                              <SelectItem value="liquids">Жидкости</SelectItem>
                                              <SelectItem value="accessories">Аксессуары</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        {editingProduct.category === 'liquids' && (
                                          <div>
                                            <Label>Вкус</Label>
                                            <Select
                                              value={editingProduct.flavor}
                                              onValueChange={(value) => setEditingProduct({ ...editingProduct, flavor: value })}
                                            >
                                              <SelectTrigger className="bg-background/50 border-border/50">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="berry">Ягоды</SelectItem>
                                                <SelectItem value="tropical">Тропик</SelectItem>
                                                <SelectItem value="mint">Мята</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        )}
                                        <div>
                                          <Label>Бейдж</Label>
                                          <Input
                                            value={editingProduct.badge || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                                            className="bg-background/50 border-border/50"
                                          />
                                        </div>
                                        <Button onClick={handleEditProduct} className="w-full bg-primary hover:bg-primary/90">
                                          Сохранить
                                        </Button>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
