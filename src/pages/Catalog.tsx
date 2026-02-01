import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import ProductDetailModal from '@/components/ProductDetailModal';
import MobileMenu from '@/components/MobileMenu';


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

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <Link 
                to="/login" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl hover:opacity-80 transition-opacity cursor-pointer overflow-hidden flex-shrink-0"
                title="Админ-панель"
              >
                <img src="https://cdn.poehali.dev/files/photo_2026-01-04_20-11-08.jpg" alt="WhiteShishka Logo" className="w-full h-full object-cover" />
              </Link>
              <Link to="/" className="flex items-center gap-2 min-w-0">
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
                  WhiteShishka
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-6 flex-shrink-0">
              <Link to="/" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors">Главная</Link>
              <Link to="/catalog" className="text-sm lg:text-base text-foreground font-medium">Каталог</Link>
              <Link to="/about" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors">О магазине</Link>
              <Link to="/delivery" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors">Доставка</Link>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
                onClick={() => window.open('https://t.me/whiteshishka_bot', '_blank')}
              >
                <Icon name="MessageCircle" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="sm:hidden">Бот</span>
                <span className="hidden sm:inline">Написать в бот</span>
              </Button>
              <MobileMenu currentPath="/catalog" />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Каталог товаров
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Широкий ассортимент устройств, жидкостей и аксессуаров
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          <aside className="lg:col-span-1 space-y-4 md:space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-4 md:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm md:text-base">
                  <Icon name="Filter" size={16} className="md:w-[18px] md:h-[18px]" />
                  Фильтры
                </h3>
                
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-3 block">Категория</label>
                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                      <TabsList className="grid grid-cols-1 gap-2 h-auto p-1 bg-transparent">
                        <TabsTrigger value="all" className="justify-start text-xs md:text-sm px-2 md:px-3 py-2">Все товары</TabsTrigger>
                        <TabsTrigger value="Одноразки" className="justify-start text-xs md:text-sm px-2 md:px-3 py-2">Одноразки</TabsTrigger>
                        <TabsTrigger value="Жидкости" className="justify-start text-xs md:text-sm px-2 md:px-3 py-2">Жидкости</TabsTrigger>
                        <TabsTrigger value="Аксессуары" className="justify-start text-xs md:text-sm px-2 md:px-3 py-2">Аксессуары</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div>
                    <label className="text-xs md:text-sm font-medium mb-3 block">Цена</label>
                    <Tabs value={priceRange} onValueChange={setPriceRange}>
                      <TabsList className="grid grid-cols-1 gap-2 h-auto p-1 bg-transparent">
                        <TabsTrigger value="all" className="justify-start text-xs md:text-sm px-2 md:px-3 py-2">Любая</TabsTrigger>
                        <TabsTrigger value="low" className="justify-start text-xs md:text-sm px-2 md:px-3 py-2">До 1000₽</TabsTrigger>
                        <TabsTrigger value="mid" className="justify-start text-xs md:text-sm px-2 md:px-3 py-2">1000-3000₽</TabsTrigger>
                        <TabsTrigger value="high" className="justify-start text-xs md:text-sm px-2 md:px-3 py-2">От 3000₽</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Найдено товаров: <span className="font-semibold text-foreground">{filteredProducts.length}</span>
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadProducts}
                disabled={loading}
                aria-label="Обновить список товаров"
              >
                <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
              </Button>
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
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Товары не найдены</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {filteredProducts.map(product => {
                  const finalPrice = calculateFinalPrice(product.price, product.discount);
                  return (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden bg-muted/50">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {product.is_new && (
                            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] md:text-xs px-1.5 md:px-2 py-0.5">
                              Новинка
                            </Badge>
                          )}
                          {product.discount > 0 && (
                            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[10px] md:text-xs px-1.5 md:px-2 py-0.5">
                              -{product.discount}%
                            </Badge>
                          )}
                          {!product.in_stock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <Badge variant="secondary" className="text-[10px] md:text-xs">Нет в наличии</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-2 md:p-3">
                          <h3 className="font-semibold mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2 text-xs md:text-sm">
                            {product.name}
                          </h3>
                          <p className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-3 line-clamp-2 hidden sm:block">
                            {product.short_description}
                          </p>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                              {product.discount > 0 && (
                                <span className="text-[10px] md:text-xs text-muted-foreground line-through block">
                                  {product.price}₽
                                </span>
                              )}
                              <span className="text-base md:text-xl font-bold text-primary">
                                {Math.round(finalPrice)}₽
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="gap-1 text-[10px] md:text-xs px-2 py-1 h-auto w-full sm:w-auto"
                              onClick={() => handleProductClick(product)}
                            >
                              <Icon name="Info" size={12} className="md:w-3.5 md:h-3.5" />
                              <span className="hidden sm:inline">Подробнее</span>
                              <span className="sm:hidden">Инфо</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 mt-20 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <div className="space-y-2">
              <p>© 2026 WhiteShishka. Все права защищены.</p>
              <p className="text-sm">Сайт несёт исключительно информационный характер и не продвигает какие либо товары или услуги. Контент может содержать материалы, не предназначенные для несовершеннолетних!</p>
            </div>
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