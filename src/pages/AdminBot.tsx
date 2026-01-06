import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://functions.poehali.dev/cb477bba-2123-4ab1-9cc4-a5bb4c716444';

interface BotSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  description: string;
}

interface BotMessage {
  id: number;
  message_key: string;
  message_text: string;
  description: string;
}

const AdminBot = () => {
  const [settings, setSettings] = useState<BotSetting[]>([]);
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    setWebhookUrl(API_URL);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to load bot settings');
      const data = await response.json();
      setSettings(data.settings || []);
      setMessages(data.messages || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось загрузить настройки',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, messages }),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      toast({
        title: 'Успешно',
        description: 'Настройки бота сохранены',
      });
      await loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сохранить',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev =>
      prev.map(s => (s.setting_key === key ? { ...s, setting_value: value } : s))
    );
  };

  const updateMessage = (key: string, value: string) => {
    setMessages(prev =>
      prev.map(m => (m.message_key === key ? { ...m, message_text: value } : m))
    );
  };

  const getSetting = (key: string) => settings.find(s => s.setting_key === key);
  const getMessage = (key: string) => messages.find(m => m.message_key === key);

  const botEnabled = getSetting('bot_enabled')?.setting_value === 'true';

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon name="Bot" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Настройка Telegram-бота
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin'}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Назад
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                <Icon name="Home" size={16} className="mr-2" />
                На сайт
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Settings" size={20} />
                Основные настройки
              </CardTitle>
              <CardDescription>
                Настройте подключение и параметры бота
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="bot_enabled" className="text-base">Включить бота</Label>
                  <p className="text-sm text-muted-foreground">
                    {getSetting('bot_enabled')?.description}
                  </p>
                </div>
                <Switch
                  id="bot_enabled"
                  checked={botEnabled}
                  onCheckedChange={(checked) => updateSetting('bot_enabled', checked ? 'true' : 'false')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bot_token">Токен бота</Label>
                <Input
                  id="bot_token"
                  type="password"
                  value={getSetting('bot_token')?.setting_value || ''}
                  onChange={(e) => updateSetting('bot_token', e.target.value)}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                />
                <p className="text-xs text-muted-foreground">
                  {getSetting('bot_token')?.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_chat_id">ID чата администратора</Label>
                <Input
                  id="admin_chat_id"
                  value={getSetting('admin_chat_id')?.setting_value || ''}
                  onChange={(e) => updateSetting('admin_chat_id', e.target.value)}
                  placeholder="123456789"
                />
                <p className="text-xs text-muted-foreground">
                  {getSetting('admin_chat_id')?.description}
                </p>
              </div>

              <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="Link" size={16} />
                  Webhook URL для бота
                </Label>
                <div className="flex gap-2">
                  <Input value={webhookUrl} readOnly className="font-mono text-sm" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      toast({ title: 'Скопировано', description: 'URL скопирован в буфер обмена' });
                    }}
                  >
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Используйте этот URL для настройки webhook в Telegram через Bot API
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="MessageSquare" size={20} />
                Шаблоны сообщений
              </CardTitle>
              <CardDescription>
                Настройте текст сообщений бота
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.map((message) => (
                <div key={message.message_key} className="space-y-2">
                  <Label htmlFor={message.message_key}>
                    {message.description || message.message_key}
                  </Label>
                  <Textarea
                    id={message.message_key}
                    value={message.message_text}
                    onChange={(e) => updateMessage(message.message_key, e.target.value)}
                    rows={3}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" size={20} />
                Инструкция по настройке
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Создайте бота через @BotFather в Telegram и получите токен</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>Вставьте токен в поле выше и включите бота</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Скопируйте Webhook URL и настройте его через Bot API:</span>
              </div>
              <code className="block p-3 bg-muted rounded text-xs overflow-x-auto">
                curl -X POST https://api.telegram.org/bot{'{'}YOUR_TOKEN{'}'}/setWebhook -d url={webhookUrl}
              </code>
              <div className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>Узнайте свой Chat ID (напишите @userinfobot в Telegram)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">5.</span>
                <span>Вставьте Chat ID в настройки для получения уведомлений</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={loadData} disabled={loading}>
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить настройки
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBot;
