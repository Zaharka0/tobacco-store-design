import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function AdminNav() {
  return (
    <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Icon name="Shield" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WhiteShishka Admin
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/analytics'}>
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/texts'}>
              <Icon name="Type" size={16} className="mr-2" />
              Тексты
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/bot'}>
              <Icon name="Bot" size={16} className="mr-2" />
              Telegram
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
              <Icon name="Home" size={16} className="mr-2" />
              На сайт
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
