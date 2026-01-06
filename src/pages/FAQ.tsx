import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const faqCategories = [
    {
      category: 'Заказ и оплата',
      icon: 'ShoppingCart',
      questions: [
        {
          question: 'Как оформить заказ?',
          answer: 'Добавьте понравившиеся товары в корзину, затем перейдите к оформлению. Заполните форму с контактными данными и выберите способ доставки и оплаты. Мы свяжемся с вами для подтверждения заказа.'
        },
        {
          question: 'Какие способы оплаты доступны?',
          answer: 'Мы принимаем оплату наличными при получении, банковскими картами онлайн, через СБП и по счету для юридических лиц. Все способы оплаты безопасны и защищены.'
        },
        {
          question: 'Можно ли отменить или изменить заказ?',
          answer: 'Да, вы можете отменить или изменить заказ до момента его отправки. Свяжитесь с нашей службой поддержки по телефону или через чат на сайте.'
        }
      ]
    },
    {
      category: 'Доставка',
      icon: 'Truck',
      questions: [
        {
          question: 'Сколько стоит доставка?',
          answer: 'Стоимость курьерской доставки от 300₽, самовывоз бесплатный. При заказе от 3000₽ доставка по городу бесплатная. Доставка почтой России от 250₽ в зависимости от региона.'
        },
        {
          question: 'Как быстро доставят заказ?',
          answer: 'Курьерская доставка по городу занимает 1-2 дня, экспресс-доставка 3-4 часа. Самовывоз можно забрать в тот же день. Почта России доставляет от 5 до 14 дней в зависимости от региона.'
        },
        {
          question: 'Можно ли выбрать время доставки?',
          answer: 'Да, при оформлении заказа укажите удобное время, и курьер свяжется с вами для согласования. Для экспресс-доставки можно выбрать конкретный временной интервал.'
        }
      ]
    },
    {
      category: 'Товары и гарантии',
      icon: 'Package',
      questions: [
        {
          question: 'Все товары оригинальные?',
          answer: 'Да, мы работаем только с официальными поставщиками и гарантируем 100% оригинальность всех товаров. На каждое устройство предоставляется гарантия производителя.'
        },
        {
          question: 'Есть ли гарантия на устройства?',
          answer: 'Да, на все под-системы и устройства действует гарантия от 6 до 12 месяцев в зависимости от производителя. При обнаружении производственного брака мы произведем замену или возврат средств.'
        },
        {
          question: 'Можно ли вернуть товар?',
          answer: 'Да, товар надлежащего качества можно вернуть в течение 7 дней с момента получения. Товар должен сохранить товарный вид и упаковку. Жидкости возврату не подлежат по санитарным нормам.'
        }
      ]
    },
    {
      category: 'Использование',
      icon: 'HelpCircle',
      questions: [
        {
          question: 'Как выбрать свое первое устройство?',
          answer: 'Для начинающих рекомендуем под-системы типа JUUL или Vaporesso XROS - они просты в использовании, не требуют настройки и обслуживания. Наши консультанты помогут подобрать оптимальный вариант.'
        },
        {
          question: 'Как часто нужно менять картриджи?',
          answer: 'В среднем одного картриджа хватает на 200-300 затяжек, что примерно равно 1-2 дням использования. Меняйте картридж, когда почувствуете изменение вкуса или снижение количества пара.'
        },
        {
          question: 'Какая крепость жидкости подойдет?',
          answer: 'Для бывших курильщиков рекомендуем начать с 20-50 мг/мл. Для легкого парения подойдет 3-6 мг/мл. Наши консультанты помогут выбрать оптимальную крепость под ваши потребности.'
        }
      ]
    }
  ];

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
                WhiteShishka
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Главная</Link>
              <Link to="/catalog" className="text-muted-foreground hover:text-foreground transition-colors">Каталог</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">О магазине</Link>
              <Link to="/delivery" className="text-muted-foreground hover:text-foreground transition-colors">Доставка</Link>
              <Link to="/promotions" className="text-muted-foreground hover:text-foreground transition-colors">Акции</Link>
              <Link to="/faq" className="text-foreground font-medium">FAQ</Link>
            </div>
            <div className="flex items-center gap-3">
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
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Часто задаваемые вопросы
            </h1>
            <p className="text-xl text-muted-foreground">
              Ответы на популярные вопросы наших клиентов
            </p>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, idx) => (
              <Card key={idx} className="border-border/50">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name={category.icon as any} className="text-primary" size={22} />
                    </div>
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((item, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`} className="border-border/50">
                        <AccordionTrigger className="text-left hover:text-primary">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 mt-12">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="MessageCircle" size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Не нашли ответ на свой вопрос?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Напишите в наш Telegram-бот @whiteshishka_bot - мы ответим на все ваши вопросы!
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button 
                    className="gap-2"
                    onClick={() => window.open('https://t.me/whiteshishka_bot', '_blank')}
                  >
                    <Icon name="MessageCircle" size={18} />
                    Написать в бот
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => window.open('https://t.me/whiteshishka_bot', '_blank')}
                  >
                    <Icon name="Send" size={18} />
                    @whiteshishka_bot
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Icon name="Mail" size={18} />
                    info@vapeshop.ru
                  </Button>
                </div>
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