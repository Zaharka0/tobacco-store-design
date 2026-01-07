import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import CartDrawer from '@/components/CartDrawer';

export default function Promotions() {
  const promotions = [
    {
      id: 1,
      title: 'Скидка 20% на все под-системы',
      description: 'Успей купить новейшие устройства со скидкой! Акция действует до конца месяца.',
      discount: '-20%',
      validUntil: '31 января',
      image: '/placeholder.svg',
      type: 'sale'
    },
    {
      id: 2,
      title: 'Жидкость в подарок',
      description: 'При покупке устройства от 3000₽ получите жидкость любого вкуса в подарок!',
      discount: 'Подарок',
      validUntil: '15 февраля',
      image: '/placeholder.svg',
      type: 'gift'
    },
    {
      id: 3,
      title: 'Новинки месяца -15%',
      description: 'Специальная цена на последние новинки от ведущих производителей.',
      discount: '-15%',
      validUntil: '7 февраля',
      image: '/placeholder.svg',
      type: 'new'
    },
    {
      id: 4,
      title: 'Набор для новичков',
      description: 'Устройство + 3 жидкости + зарядка = полный комплект со скидкой 25%!',
      discount: '-25%',
      validUntil: '28 февраля',
      image: '/placeholder.svg',
      type: 'bundle'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl hover:opacity-80 transition-opacity cursor-pointer overflow-hidden">
                <img src="https://cdn.poehali.dev/files/photo_2026-01-07_19-49-14.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                WhiteShishka
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Главная</Link>
              <Link to="/catalog" className="text-muted-foreground hover:text-foreground transition-colors">Каталог</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">О магазине</Link>
              <Link to="/delivery" className="text-muted-foreground hover:text-foreground transition-colors">Доставка</Link>
              <Link to="/promotions" className="text-foreground font-medium">Акции</Link>
              <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </div>
            <div className="flex items-center gap-3">
              <CartDrawer />
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

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Акции и специальные предложения
            </h1>
            <p className="text-xl text-muted-foreground">
              Выгодные предложения для наших клиентов
            </p>
          </div>

          <Card className="border-border/50 mb-12 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <Badge className="mb-4 text-base px-4 py-2">
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  Программа лояльности
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Копите бонусы и экономьте!</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Получайте 5% от каждой покупки на бонусный счет и оплачивайте до 30% следующего заказа бонусами
                </p>
                <Button size="lg" className="gap-2">
                  <Icon name="Gift" size={18} />
                  Узнать подробнее
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {promotions.map(promo => (
              <Card key={promo.id} className="border-border/50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-muted/50 h-48">
                    <img 
                      src={promo.image} 
                      alt={promo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="text-lg px-4 py-2 bg-accent text-accent-foreground shadow-lg">
                        {promo.discount}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">до {promo.validUntil}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {promo.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {promo.description}
                    </p>
                    <Button className="w-full gap-2">
                      <Icon name="ShoppingBag" size={18} />
                      Перейти в каталог
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Bell" size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Не пропустите новые акции!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Подпишитесь на рассылку и узнавайте первыми о специальных предложениях и эксклюзивных скидках
                </p>
                <div className="flex gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Ваш email"
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button className="gap-2">
                    <Icon name="Send" size={18} />
                    Подписаться
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Нажимая "Подписаться", вы соглашаетесь с политикой конфиденциальности
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border/50 mt-20 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2026 WhiteShishka. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}