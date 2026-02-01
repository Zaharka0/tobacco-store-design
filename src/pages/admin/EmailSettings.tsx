import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import funcUrls from '../../../backend/func2url.json';

export default function EmailSettings() {
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<any>(null);
  const { toast } = useToast();
  const API_URL = funcUrls['promotions'] || 'https://functions.poehali.dev/promotions-temp';

  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректный email адрес',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    setSmtpStatus(null);

    try {
      const response = await fetch(`${API_URL}?action=test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      const data = await response.json();

      if (response.ok) {
        setSmtpStatus({ success: true, message: data.message });
        toast({
          title: 'Успешно!',
          description: `Тестовое письмо отправлено на ${testEmail}`,
        });
      } else {
        setSmtpStatus({ success: false, error: data.error, missing: data.missing_params });
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить письмо',
          variant: 'destructive'
        });
      }
    } catch (error) {
      setSmtpStatus({ success: false, error: 'Не удалось подключиться к серверу' });
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Настройки Email</h1>
        <p className="text-muted-foreground mt-2">
          Проверьте работу email-рассылки и настройте SMTP параметры
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Тестовая отправка письма</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Введите email для тестовой отправки
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTestEmail()}
                  placeholder="test@example.com"
                  disabled={sending}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={handleTestEmail} disabled={sending} className="gap-2">
                  {sending ? (
                    <Icon name="Loader2" size={18} className="animate-spin" />
                  ) : (
                    <Icon name="Send" size={18} />
                  )}
                  Отправить тест
                </Button>
              </div>
            </div>

            {smtpStatus && (
              <div className={`p-4 rounded-lg ${smtpStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <Icon 
                    name={smtpStatus.success ? 'CheckCircle' : 'AlertCircle'} 
                    size={20} 
                    className={smtpStatus.success ? 'text-green-600' : 'text-red-600'}
                  />
                  <div className="flex-1">
                    <h4 className={`font-semibold ${smtpStatus.success ? 'text-green-900' : 'text-red-900'}`}>
                      {smtpStatus.success ? 'Успешно' : 'Ошибка'}
                    </h4>
                    <p className={`text-sm mt-1 ${smtpStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                      {smtpStatus.success ? smtpStatus.message : smtpStatus.error}
                    </p>
                    
                    {smtpStatus.missing && smtpStatus.missing.length > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm font-medium text-yellow-900 mb-2">
                          Не заполнены следующие параметры:
                        </p>
                        <ul className="list-disc list-inside text-sm text-yellow-800">
                          {smtpStatus.missing.map((param: string) => (
                            <li key={param}>{param}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Инструкция по настройке SMTP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Для работы email-рассылки необходимо заполнить 4 параметра в настройках проекта:
          </p>

          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-semibold mb-1">SMTP_HOST</h4>
              <p className="text-sm text-muted-foreground">
                SMTP сервер вашей почты (например: smtp.yandex.ru, smtp.gmail.com, smtp.mail.ru)
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-semibold mb-1">SMTP_PORT</h4>
              <p className="text-sm text-muted-foreground">
                Порт SMTP сервера (обычно 587 для TLS или 465 для SSL)
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-semibold mb-1">SMTP_USER</h4>
              <p className="text-sm text-muted-foreground">
                Email адрес от которого будут отправляться письма
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-semibold mb-1">SMTP_PASSWORD</h4>
              <p className="text-sm text-muted-foreground">
                Пароль от почты или пароль приложения (для Gmail/Yandex используйте пароль приложения)
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">Как получить пароль приложения?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li><strong>Yandex:</strong> Настройки → Безопасность → Пароли приложений</li>
                  <li><strong>Gmail:</strong> Аккаунт Google → Безопасность → Двухэтапная аутентификация → Пароли приложений</li>
                  <li><strong>Mail.ru:</strong> Настройки → Пароль и безопасность → Пароли для внешних приложений</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}