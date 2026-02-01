import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MobileMenu from '@/components/MobileMenu';
import ThemeToggle from '@/components/ThemeToggle';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Icon name="Flower2" size={24} className="text-primary" />
              <span className="font-semibold text-base md:text-lg">
                WhiteShishka
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 flex-shrink-0">
              <Link to="/" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors">Главная</Link>
              <Link to="/catalog" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors">Каталог</Link>
              <Link to="/about" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors">О магазине</Link>
              <Link to="/delivery" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors">Доставка</Link>
              <Link to="/privacy" className="text-sm lg:text-base text-foreground font-medium">Конфиденциальность</Link>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
                onClick={() => window.open('https://t.me/whiteshishka_bot', '_blank')}
              >
                <Icon name="Send" size={16} />
                <span className="hidden sm:inline">Telegram</span>
              </Button>
              <MobileMenu currentPath="/privacy" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Политика конфиденциальности</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section className="bg-muted/30 p-6 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-0">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
              <p className="text-muted-foreground leading-relaxed">
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных 
                пользователей сайта WhiteShishka. Используя наш сайт, вы соглашаетесь с условиями данной политики.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Мы уважаем вашу конфиденциальность и обязуемся защищать ваши персональные данные в соответствии 
                с действующим законодательством Российской Федерации.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Какие данные мы собираем</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                При использовании нашего сайта мы можем собирать следующую информацию:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Контактные данные: имя, email, номер телефона (при регистрации или оформлении заказа)</li>
                <li>Данные об использовании сайта: просмотренные страницы, время визита, IP-адрес</li>
                <li>Технические данные: тип браузера, операционная система, разрешение экрана</li>
                <li>Информация о заказах: выбранные товары, способ доставки и оплаты</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Как мы используем данные</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Собранные данные используются для:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Обработки и выполнения ваших заказов</li>
                <li>Связи с вами по вопросам заказа или обслуживания</li>
                <li>Улучшения работы сайта и качества обслуживания</li>
                <li>Отправки информации о новых товарах и специальных предложениях (только с вашего согласия)</li>
                <li>Анализа статистики посещаемости и поведения пользователей</li>
                <li>Защиты от мошенничества и злоупотреблений</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Защита данных</h2>
              <p className="text-muted-foreground leading-relaxed">
                Мы применяем современные технические и организационные меры для защиты ваших персональных данных 
                от несанкционированного доступа, изменения, раскрытия или уничтожения:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>Шифрование передачи данных по протоколу HTTPS</li>
                <li>Ограниченный доступ сотрудников к персональным данным</li>
                <li>Регулярное резервное копирование данных</li>
                <li>Использование защищённых серверов и баз данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Передача данных третьим лицам</h2>
              <p className="text-muted-foreground leading-relaxed">
                Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением случаев, 
                необходимых для выполнения заказа:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>Службы доставки — для доставки заказа по указанному адресу</li>
                <li>Платёжные системы — для обработки онлайн-платежей (при наличии)</li>
                <li>Аналитические сервисы — для анализа работы сайта (Яндекс.Метрика, Google Analytics)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Все партнёры обязаны соблюдать конфиденциальность ваших данных и использовать их только 
                для выполнения своих функций.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Файлы cookie</h2>
              <p className="text-muted-foreground leading-relaxed">
                Наш сайт использует файлы cookie для улучшения вашего опыта использования. Cookie — это небольшие 
                текстовые файлы, которые сохраняются на вашем устройстве при посещении сайта.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Мы используем cookie для:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-2">
                <li>Запоминания ваших предпочтений и настроек</li>
                <li>Анализа трафика и поведения пользователей</li>
                <li>Сохранения товаров в корзине</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Вы можете отключить cookie в настройках браузера, но это может ограничить функциональность сайта.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Ваши права</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                В соответствии с законодательством РФ вы имеете право:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Получать информацию о том, какие ваши данные мы храним</li>
                <li>Требовать исправления неточных или неполных данных</li>
                <li>Требовать удаления ваших персональных данных</li>
                <li>Отозвать согласие на обработку данных в любой момент</li>
                <li>Ограничить обработку ваших данных</li>
                <li>Получить копию ваших данных в структурированном формате</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Для реализации этих прав свяжитесь с нами через Telegram или форму обратной связи.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Хранение данных</h2>
              <p className="text-muted-foreground leading-relaxed">
                Мы храним ваши персональные данные только в течение периода, необходимого для достижения целей, 
                для которых они были собраны, или в соответствии с требованиями законодательства.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                После окончания срока хранения данные удаляются или обезличиваются.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Изменения в политике</h2>
              <p className="text-muted-foreground leading-relaxed">
                Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. 
                Все изменения вступают в силу с момента их публикации на сайте.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Рекомендуем периодически проверять эту страницу для ознакомления с актуальной версией политики.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Контакты</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                По вопросам обработки персональных данных и реализации ваших прав обращайтесь:
              </p>
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 space-y-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Telegram:</strong> @whiteshishka_bot
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Сайт:</strong> whiteshishka.ru
                </p>
              </div>
            </section>

            <section className="bg-accent/10 p-6 rounded-lg border border-accent/30">
              <p className="text-sm text-muted-foreground mb-0">
                <strong className="text-foreground">Важно:</strong> Продолжая использовать наш сайт, вы подтверждаете, 
                что ознакомились с настоящей Политикой конфиденциальности и согласны с её условиями.
              </p>
            </section>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="outline" size="lg">
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </Button>
            </Link>
            <Link to="/catalog">
              <Button size="lg">
                <Icon name="ShoppingBag" size={18} className="mr-2" />
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Flower2" size={20} className="text-primary" />
                WhiteShishka
              </h3>
              <p className="text-sm text-muted-foreground">
                Информационный сайт. Контент не предназначен для несовершеннолетних.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Навигация</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Главная</Link></li>
                <li><Link to="/catalog" className="text-muted-foreground hover:text-foreground transition-colors">Каталог</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">О магазине</Link></li>
                <li><Link to="/delivery" className="text-muted-foreground hover:text-foreground transition-colors">Доставка</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Контакты</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={() => window.open('https://t.me/whiteshishka_bot', '_blank')}
              >
                <Icon name="Send" size={16} />
                Telegram бот
              </Button>
            </div>
          </div>
          <div className="pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} WhiteShishka. Все права защищены.</p>
            <p className="mt-2">
              <Link to="/privacy" className="hover:text-foreground transition-colors font-medium">
                Политика конфиденциальности
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}