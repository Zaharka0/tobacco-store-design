import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { usePageContent } from '@/hooks/usePageContent';
import { Link } from 'react-router-dom';
import ProductDetailModal from '@/components/ProductDetailModal';

const API_URL = 'https://functions.poehali.dev/c081b0cd-f1c8-458a-8d98-7d416cd99718';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  short_description: string;
  full_description: string;
  features: Record<string, string>;
  in_stock: boolean;
  is_new: boolean;
  discount: number;
}

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onlineUsers = useOnlineUsers();
  const { getText, getJson } = usePageContent('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (priceRange === 'low' && product.price > 1000) return false;
    if (priceRange === 'mid' && (product.price < 1000 || product.price > 3000)) return false;
    if (priceRange === 'high' && product.price < 3000) return false;
    return true;
  });

  const featuredProducts = products.filter(p => p.is_new).slice(0, 8);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const calculateFinalPrice = (price: number, discount: number) => {
    return discount > 0 ? price - (price * discount / 100) : price;
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="w-10 h-10 rounded-xl hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
                title="Админ-панель"
              >
                <img src="https://cdn.poehali.dev/files/image.png" alt="Logo" className="w-full h-full object-cover" />
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  WhiteShishka
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-foreground font-medium">Главная</Link>
              <Link to="/catalog" className="text-muted-foreground hover:text-foreground transition-colors">Каталог</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">О магазине</Link>
              <Link to="/delivery" className="text-muted-foreground hover:text-foreground transition-colors">Доставка</Link>
              <Link to="/promotions" className="text-muted-foreground hover:text-foreground transition-colors">Акции</Link>
              <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-medium">{onlineUsers} онлайн</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => window.open('https://t.me/whiteshishka_bot', '_blank')}
              >
                <Icon name="MessageCircle" size={16} />
                <span className="hidden sm:inline">Написать в бот</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Badge className="mb-4 px-4 py-1 text-sm bg-primary/20 text-primary border-primary/50">
              {getText('hero_badge', '18+')}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              {getText('hero_title', 'Премиум Вейп-Магазин')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {getText('hero_subtitle', 'Широкий выбор под систем, жидкостей и аксессуаров от проверенных производителей')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/catalog">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <Icon name="Eye" size={20} className="mr-2" />
                  Смотреть каталог
                </Button>
              </Link>
              <Link to="/promotions">
                <Button size="lg" variant="outline" className="border-2">
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Акции
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(getJson('categories', { items: [
              { icon: 'Cigarette', title: 'Одноразки', desc: 'Удобно и просто' },
              { icon: 'Droplets', title: 'Жидкости', desc: 'Все вкусы' },
              { icon: 'Puzzle', title: 'Аксессуары', desc: 'Для всех моделей' },
            ]}).items || []).map((item: any, i: number) => (
              <Card key={i} className="border-border/50 bg-card/80 backdrop-blur hover:border-primary/50 transition-all hover:scale-105 animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Icon name={item.icon as any} className="text-primary" size={24} />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{getText('catalog_title', 'Каталог товаров')}</h2>
            <p className="text-muted-foreground">{getText('catalog_subtitle', 'Выберите категорию и фильтры для удобного поиска')}</p>
          </div>

          <div className="mb-8 space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Категория</label>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/50">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="Одноразки">Одноразки</TabsTrigger>
                  <TabsTrigger value="Жидкости">Жидкости</TabsTrigger>
                  <TabsTrigger value="Аксессуары">Аксессуары</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Цена</label>
              <Tabs value={priceRange} onValueChange={setPriceRange}>
                <TabsList className="bg-card/50">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="low">До 1000₽</TabsTrigger>
                  <TabsTrigger value="mid">1000-3000₽</TabsTrigger>
                  <TabsTrigger value="high">От 3000₽</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="Loader2" className="animate-spin" size={48} />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadProducts}>Попробовать снова</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.slice(0, 8).map((product) => {
                const finalPrice = calculateFinalPrice(product.price, product.discount);
                return (
                  <Card 
                    key={product.id} 
                    className="group hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden bg-muted/50">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.is_new && (
                          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">
                            Новинка
                          </Badge>
                        )}
                        {product.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs">
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="mt-2">
                          {product.discount > 0 && (
                            <span className="text-xs text-muted-foreground line-through block">
                              {product.price}₽
                            </span>
                          )}
                          <span className="text-xl font-bold text-primary">
                            {Math.round(finalPrice)}₽
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="gap-2">
                Смотреть весь каталог
                <Icon name="ArrowRight" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 text-sm">Новинки</Badge>
              <h2 className="text-4xl font-bold mb-4">Последние поступления</h2>
              <p className="text-muted-foreground">Самые свежие товары в нашем магазине</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const finalPrice = calculateFinalPrice(product.price, product.discount);
                return (
                  <Card 
                    key={product.id} 
                    className="group hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden bg-muted/50">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">
                          Новинка
                        </Badge>
                        {product.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs">
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="mt-2">
                          {product.discount > 0 && (
                            <span className="text-xs text-muted-foreground line-through block">
                              {product.price}₽
                            </span>
                          )}
                          <span className="text-xl font-bold text-primary">
                            {Math.round(finalPrice)}₽
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-border/50 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>© 2026 WhiteShishka. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <ProductDetailModal 
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}