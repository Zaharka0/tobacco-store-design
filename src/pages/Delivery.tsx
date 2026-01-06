import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

export default function Delivery() {
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
              <Link to="/catalog" className="text-muted-foreground hover:text-foreground transition-colors">Каталог</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">О магазине</Link>
              <Link to="/delivery" className="text-foreground font-medium">Доставка</Link>
              <Link to="/promotions" className="text-muted-foreground hover:text-foreground transition-colors">Акции</Link>
              <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Icon name="Phone" size={16} />
                <span className="hidden sm:inline">+7 (999) 123-45-67</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Доставка и оплата
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Быстро, удобно и надежно доставим ваш заказ
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Truck" size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Курьерская доставка</h3>
                <p className="text-muted-foreground mb-4">
                  Доставим заказ в удобное для вас время. Бесплатно при заказе от 3000₽.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Срок доставки:</span>
                    <span className="font-semibold">1-2 дня</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Стоимость:</span>
                    <span className="font-semibold">от 300₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Icon name="MapPin" size={28} className="text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Самовывоз</h3>
                <p className="text-muted-foreground mb-4">
                  Заберите заказ из нашего пункта выдачи в удобное время. Всегда бесплатно!
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Срок готовности:</span>
                    <span className="font-semibold">В тот же день</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Стоимость:</span>
                    <span className="font-semibold text-accent">Бесплатно</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Package" size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Почта России</h3>
                <p className="text-muted-foreground mb-4">
                  Доставка в любую точку России через почтовые отделения.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Срок доставки:</span>
                    <span className="font-semibold">5-14 дней</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Стоимость:</span>
                    <span className="font-semibold">от 250₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Icon name="Zap" size={28} className="text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Экспресс-доставка</h3>
                <p className="text-muted-foreground mb-4">
                  Срочная доставка в течение 3-4 часов по городу.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Срок доставки:</span>
                    <span className="font-semibold">3-4 часа</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Стоимость:</span>
                    <span className="font-semibold">от 600₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Icon name="CreditCard" className="text-primary" />
                Способы оплаты
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Wallet" className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Наличными</h3>
                    <p className="text-sm text-muted-foreground">При получении курьеру или в пункте выдачи</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="CreditCard" className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Картой онлайн</h3>
                    <p className="text-sm text-muted-foreground">Безопасная оплата на сайте</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Smartphone" className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">СБП</h3>
                    <p className="text-sm text-muted-foreground">Система быстрых платежей</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Building" className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">По счету</h3>
                    <p className="text-sm text-muted-foreground">Для юридических лиц</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Info" className="text-primary" />
                Важная информация
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Все заказы тщательно упаковываются для безопасной доставки</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Вы можете отследить статус заказа в личном кабинете</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">При повреждении товара при доставке — полный возврат средств</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Доставка осуществляется только для лиц старше 18 лет</span>
                </li>
              </ul>
            </CardContent>
          </Card>
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