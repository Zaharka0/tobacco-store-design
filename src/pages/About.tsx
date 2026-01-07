import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import CartDrawer from '@/components/CartDrawer';

export default function About() {
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
              <Link to="/about" className="text-foreground font-medium">О магазине</Link>
              <Link to="/delivery" className="text-muted-foreground hover:text-foreground transition-colors">Доставка</Link>
              <Link to="/promotions" className="text-muted-foreground hover:text-foreground transition-colors">Акции</Link>
              <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </div>
            <div className="flex items-center gap-3">
              <CartDrawer />
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                >
                  <Icon name="User" size={16} />
                  <span className="hidden sm:inline">Мои заказы</span>
                </Button>
              </Link>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            О магазине WhiteShishka
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Ваш надежный партнер в мире вейпинга с 2025 года
          </p>



          <div className="prose prose-lg max-w-none space-y-8">
            <Card className="border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="Target" className="text-primary" />
                  Наша миссия
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Мы создаем комфортное пространство для любителей вейпинга, предлагая только качественную продукцию от проверенных производителей по сочной цене ниже чем у других шопов. Наша цель — помочь каждому клиенту найти идеальное устройство и вкус, который будет радовать каждый день.
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
                    <span className="text-muted-foreground">Есть 2 вида доставки обычная и экспресс</span>
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
                  <Button className="gap-2">@whiteshishka_bot</Button>
                  <Button variant="outline" className="gap-2">
                    <Icon name="Mail" size={18} />
                    info@whiteshishkakrd.ru
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
            <p>© 2026 WhiteShishka. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}