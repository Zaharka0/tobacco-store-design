import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email(to_email: str, subject: str, html_content: str):
    '''Отправка email через SMTP'''
    
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        raise Exception('SMTP credentials not configured')
    
    msg = MIMEMultipart('alternative')
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = subject
    
    html_part = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(html_part)
    
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)


def send_welcome_email(email: str):
    '''Отправка приветственного письма новому подписчику'''
    
    subject = 'Добро пожаловать в WhiteShishka!'
    html_content = f'''
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #8B4513;">Спасибо за подписку!</h2>
                <p>Здравствуйте!</p>
                <p>Вы успешно подписались на новости и акции WhiteShishka.</p>
                <p>Теперь вы будете первыми узнавать о:</p>
                <ul>
                    <li>Новых поступлениях товаров</li>
                    <li>Специальных предложениях и скидках</li>
                    <li>Эксклюзивных акциях для подписчиков</li>
                </ul>
                <p style="margin-top: 30px;">С уважением,<br>Команда WhiteShishka</p>
                <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #888;">
                    Это письмо отправлено автоматически. Если вы хотите отписаться от рассылки, свяжитесь с нами.
                </p>
            </div>
        </body>
    </html>
    '''
    
    send_email(email, subject, html_content)
