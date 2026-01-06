import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useProducts } from '@/contexts/ProductContext';
import { Link } from 'react-router-dom';

export default function Catalog() {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (selectedFlavor !== 'all' && product.flavor !== selectedFlavor) return false;
    if (priceRange === 'low' && product.price > 1000) return false;
    if (priceRange === 'mid' && (product.price < 1000 || product.price > 3000)) return false;
    if (priceRange === 'high' && product.price < 3000) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Cigarette" className="text-primary-foreground" size={20} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VapeShop
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Главная</Link>
              <Link to="/catalog" className="text-foreground font-medium">Каталог</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">О магазине</Link>
              <Link to="/delivery" className="text-muted-foreground hover:text-foreground transition-colors">Доставка</Link>
              <Link to="/promotions" className="text-muted-foreground hover:text-foreground transition-colors">Акции</Link>
              <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Каталог товаров
          </h1>
          <p className="text-muted-foreground text-lg">
            Широкий ассортимент устройств, жидкостей и аксессуаров
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Filter" size={18} />
                  Фильтры
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Категория</label>
                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                      <TabsList className="grid grid-cols-1 gap-2 h-auto bg-transparent">
                        <TabsTrigger value="all" className="justify-start">Все товары</TabsTrigger>
                        <TabsTrigger value="pods" className="justify-start">Под-системы</TabsTrigger>
                        <TabsTrigger value="liquids" className="justify-start">Жидкости</TabsTrigger>
                        <TabsTrigger value="accessories" className="justify-start">Аксессуары</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Цена</label>
                    <Tabs value={priceRange} onValueChange={setPriceRange}>
                      <TabsList className="grid grid-cols-1 gap-2 h-auto bg-transparent">
                        <TabsTrigger value="all" className="justify-start">Любая</TabsTrigger>
                        <TabsTrigger value="low" className="justify-start">До 1000₽</TabsTrigger>
                        <TabsTrigger value="mid" className="justify-start">1000-3000₽</TabsTrigger>
                        <TabsTrigger value="high" className="justify-start">От 3000₽</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {selectedCategory === 'liquids' && (
                    <div>
                      <label className="text-sm font-medium mb-3 block">Вкус</label>
                      <Tabs value={selectedFlavor} onValueChange={setSelectedFlavor}>
                        <TabsList className="grid grid-cols-1 gap-2 h-auto bg-transparent">
                          <TabsTrigger value="all" className="justify-start">Все вкусы</TabsTrigger>
                          <TabsTrigger value="berry" className="justify-start">Ягодные</TabsTrigger>
                          <TabsTrigger value="tropical" className="justify-start">Тропические</TabsTrigger>
                          <TabsTrigger value="mint" className="justify-start">Мятные</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Найдено товаров: <span className="font-semibold text-foreground">{filteredProducts.length}</span>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden bg-muted/50">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.badge && (
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{product.price}₽</span>
                        <Button size="icon" className="rounded-full shadow-lg">
                          <Icon name="Plus" size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 mt-20 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2024 VapeShop. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
