import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

const products: Product[] = [
  { id: 1, name: 'JUUL Pod System', price: 3500, category: 'pods', image: '/placeholder.svg', badge: 'ХИТ' },
  { id: 2, name: 'SMOK Nord 4', price: 2800, category: 'pods', image: '/placeholder.svg' },
  { id: 3, name: 'Vaporesso XROS 3', price: 2200, category: 'pods', image: '/placeholder.svg', badge: 'НОВИНКА' },
  { id: 4, name: 'Жидкость Ягодный Микс', price: 450, category: 'liquids', flavor: 'berry', image: '/placeholder.svg' },
  { id: 5, name: 'Жидкость Тропик', price: 500, category: 'liquids', flavor: 'tropical', image: '/placeholder.svg', badge: 'ТОП' },
  { id: 6, name: 'Жидкость Мята', price: 420, category: 'liquids', flavor: 'mint', image: '/placeholder.svg' },
  { id: 7, name: 'USB-C Кабель', price: 350, category: 'accessories', image: '/placeholder.svg' },
  { id: 8, name: 'Сменные картриджи', price: 800, category: 'accessories', image: '/placeholder.svg' },
];

export default function Index() {
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
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Zap" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VAPE SHOP
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#catalog" className="text-sm hover:text-primary transition-colors">Каталог</a>
              <a href="#about" className="text-sm hover:text-primary transition-colors">О магазине</a>
              <a href="#delivery" className="text-sm hover:text-primary transition-colors">Доставка</a>
              <a href="#promo" className="text-sm hover:text-primary transition-colors">Акции</a>
              <a href="#blog" className="text-sm hover:text-primary transition-colors">Блог</a>
              <a href="#faq" className="text-sm hover:text-primary transition-colors">FAQ</a>
            </div>
            <Button size="icon" variant="ghost" className="md:hidden">
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Badge className="mb-4 px-4 py-1 text-sm bg-primary/20 text-primary border-primary/50">
              18+
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Премиум Вейп-Магазин
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Широкий выбор под систем, жидкостей и аксессуаров от проверенных производителей
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Перейти в каталог
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                <Icon name="Sparkles" size={20} className="mr-2" />
                Акции
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'Package', title: 'Под системы', desc: 'Широкий выбор' },
              { icon: 'Droplets', title: 'Жидкости', desc: 'Все вкусы' },
              { icon: 'Puzzle', title: 'Аксессуары', desc: 'Для всех моделей' },
              { icon: 'Shield', title: 'Гарантия', desc: 'Качество 100%' },
            ].map((item, i) => (
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
            <h2 className="text-4xl font-bold mb-4">Каталог товаров</h2>
            <p className="text-muted-foreground">Выберите категорию и фильтры для удобного поиска</p>
          </div>

          <div className="mb-8 space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Категория</label>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card/50">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="pods">Под системы</TabsTrigger>
                  <TabsTrigger value="liquids">Жидкости</TabsTrigger>
                  <TabsTrigger value="accessories">Аксессуары</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-3 block">Вкус</label>
                <Tabs value={selectedFlavor} onValueChange={setSelectedFlavor}>
                  <TabsList className="bg-card/50">
                    <TabsTrigger value="all">Все</TabsTrigger>
                    <TabsTrigger value="berry">Ягоды</TabsTrigger>
                    <TabsTrigger value="tropical">Тропик</TabsTrigger>
                    <TabsTrigger value="mint">Мята</TabsTrigger>
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
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group border-border/50 bg-card/80 backdrop-blur overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground font-semibold">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">{product.price}₽</span>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Icon name="ShoppingCart" size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="promo" className="py-20 bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/50 bg-card/80 backdrop-blur overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center">
                <Badge className="mb-4 px-4 py-1 bg-accent text-accent-foreground">🔥 Горячее предложение</Badge>
                <h2 className="text-4xl font-bold mb-4">Скидка 20% на первый заказ</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Используйте промокод <span className="font-mono font-bold text-primary">VAPE2025</span> при оформлении
                </p>
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Получить скидку
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">О магазине</h2>
              <p className="text-muted-foreground mb-4">
                Мы специализируемся на продаже качественных под систем, жидкостей и аксессуаров. 
                Работаем только с проверенными производителями и гарантируем подлинность товара.
              </p>
              <p className="text-muted-foreground mb-6">
                Наша команда — это профессионалы с многолетним опытом, которые помогут подобрать 
                идеальное устройство и вкус именно для вас.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Товаров</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">5000+</div>
                  <div className="text-sm text-muted-foreground">Клиентов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">3 года</div>
                  <div className="text-sm text-muted-foreground">На рынке</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 animate-glow" />
            </div>
          </div>
        </div>
      </section>

      <section id="delivery" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Доставка</h2>
            <p className="text-muted-foreground">Быстро и удобно по всей России</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: 'Truck', title: 'Курьером', desc: 'По Москве за 2 часа', price: 'от 300₽' },
              { icon: 'MapPin', title: 'Самовывоз', desc: 'Из пунктов выдачи', price: 'Бесплатно' },
              { icon: 'Globe', title: 'По России', desc: 'СДЭК и Почта России', price: 'от 350₽' },
            ].map((item, i) => (
              <Card key={i} className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon name={item.icon as any} className="text-primary" size={32} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                  <div className="text-primary font-bold">{item.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Блог</h2>
            <p className="text-muted-foreground">Полезные статьи и новости</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Как выбрать под систему', date: '15 янв 2025', tag: 'Гайд' },
              { title: 'Топ-5 вкусов января', date: '12 янв 2025', tag: 'Обзор' },
              { title: 'Уход за устройством', date: '8 янв 2025', tag: 'Советы' },
            ].map((post, i) => (
              <Card key={i} className="group border-border/50 bg-card/80 backdrop-blur hover:border-primary/50 transition-all cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Icon name="FileText" className="text-primary" size={48} />
                  </div>
                  <div className="p-6">
                    <Badge className="mb-3" variant="outline">{post.tag}</Badge>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Частые вопросы</h2>
              <p className="text-muted-foreground">Ответы на популярные вопросы</p>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-border/50 rounded-lg px-6 bg-card/80 backdrop-blur">
                <AccordionTrigger className="hover:text-primary">Какая минимальная сумма заказа?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Минимальная сумма заказа составляет 500 рублей. При заказе от 3000₽ — бесплатная доставка по Москве.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border border-border/50 rounded-lg px-6 bg-card/80 backdrop-blur">
                <AccordionTrigger className="hover:text-primary">Как отследить заказ?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  После оформления заказа вам придет SMS с трек-номером. Отследить посылку можно на сайте транспортной компании.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border border-border/50 rounded-lg px-6 bg-card/80 backdrop-blur">
                <AccordionTrigger className="hover:text-primary">Есть ли гарантия на товары?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Да, на все устройства распространяется гарантия производителя от 6 месяцев до 1 года.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border border-border/50 rounded-lg px-6 bg-card/80 backdrop-blur">
                <AccordionTrigger className="hover:text-primary">Можно ли вернуть товар?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Возврат возможен в течение 14 дней с момента получения заказа при условии сохранения товарного вида и упаковки.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Icon name="Zap" className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">VAPE SHOP</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Премиум магазин под систем и жидкостей
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Под системы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Жидкости</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Аксессуары</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Акции</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-primary transition-colors">О магазине</a></li>
                <li><a href="#delivery" className="hover:text-primary transition-colors">Доставка</a></li>
                <li><a href="#blog" className="hover:text-primary transition-colors">Блог</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (999) 123-45-67
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@vapeshop.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  Москва, ул. Примерная, 123
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 VAPE SHOP. Все права защищены. Продажа товаров лицам старше 18 лет.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
