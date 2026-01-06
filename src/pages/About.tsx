import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

export default function About() {
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
              <Link to="/about" className="text-foreground font-medium">О магазине</Link>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            О магазине VapeShop
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Ваш надежный партнер в мире вейпинга с 2020 года
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Award" size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">4+ года</h3>
                <p className="text-muted-foreground">на рынке вейпинга</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Icon name="Users" size={32} className="text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-2">15000+</h3>
                <p className="text-muted-foreground">довольных клиентов</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Package" size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">500+</h3>
                <p className="text-muted-foreground">товаров в наличии</p>
              </CardContent>
            </Card>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <Card className="border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="Target" className="text-primary" />
                  Наша миссия
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Мы создаем комфортное пространство для любителей вейпинга, предлагая только качественную продукцию 
                  от проверенных производителей. Наша цель — помочь каждому клиенту найти идеальное устройство 
                  и вкус, который будет радовать каждый день.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="CheckCircle" className="text-accent" />
                  Почему выбирают нас
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span className="text-muted-foreground">Только оригинальная продукция с гарантией качества</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span className="text-muted-foreground">Профессиональные консультации от опытных специалистов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span className="text-muted-foreground">Быстрая доставка по всей России</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span className="text-muted-foreground">Регулярные акции и программа лояльности</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span className="text-muted-foreground">Удобные способы оплаты и возврата</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="MessageCircle" className="text-primary" />
                  Остались вопросы?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Свяжитесь с нами любым удобным способом, и мы с радостью поможем вам!
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="gap-2">
                    <Icon name="Phone" size={18} />
                    +7 (999) 123-45-67
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Icon name="Mail" size={18} />
                    info@vapeshop.ru
                  </Button>
                </div>
              </CardContent>
            </Card>
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
