import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(event: dict, context) -> dict:
    """API для отправки email и управления подписками"""
    
    method = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    action = query_params.get('action', 'test')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        if action == 'test' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            test_email = body.get('email', '')
            
            if not test_email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email не указан'}),
                    'isBase64Encoded': False
                }
            
            smtp_host = os.environ.get('SMTP_HOST')
            smtp_port = os.environ.get('SMTP_PORT')
            smtp_user = os.environ.get('SMTP_USER')
            smtp_password = os.environ.get('SMTP_PASSWORD')
            
            missing = []
            if not smtp_host: missing.append('SMTP_HOST')
            if not smtp_port: missing.append('SMTP_PORT')
            if not smtp_user: missing.append('SMTP_USER')
            if not smtp_password: missing.append('SMTP_PASSWORD')
            
            if missing:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'error': f'Не заполнены параметры SMTP: {", ".join(missing)}',
                        'missing_params': missing
                    }),
                    'isBase64Encoded': False
                }
            
            try:
                msg = MIMEMultipart('alternative')
                msg['From'] = smtp_user
                msg['To'] = test_email
                msg['Subject'] = 'Тестовое письмо WhiteShishka'
                
                html_content = '<h2>✅ Тест успешен!</h2><p>SMTP настроен правильно, письма работают.</p>'
                html_part = MIMEText(html_content, 'html', 'utf-8')
                msg.attach(html_part)
                
                with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_password)
                    server.send_message(msg)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': f'Тестовое письмо отправлено на {test_email}'
                    }),
                    'isBase64Encoded': False
                }
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'error': f'Ошибка отправки: {str(e)}'
                    }),
                    'isBase64Encoded': False
                }
        
        elif action == 'subscribe' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            email = body.get('email', '').strip()
            
            if not email or '@' not in email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Некорректный email адрес'}),
                    'isBase64Encoded': False
                }
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute('''
                INSERT INTO newsletter_subscribers (email, subscribed_at, active)
                VALUES (%s, NOW(), true)
                ON CONFLICT (email) 
                DO UPDATE SET active = true, subscribed_at = NOW()
                RETURNING id
            ''', (email,))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            try:
                smtp_host = os.environ.get('SMTP_HOST')
                smtp_port = int(os.environ.get('SMTP_PORT', 587))
                smtp_user = os.environ.get('SMTP_USER')
                smtp_password = os.environ.get('SMTP_PASSWORD')
                
                msg = MIMEMultipart('alternative')
                msg['From'] = smtp_user
                msg['To'] = email
                msg['Subject'] = 'Добро пожаловать в WhiteShishka!'
                
                html_content = '''
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
                        </div>
                    </body>
                </html>
                '''
                
                html_part = MIMEText(html_content, 'html', 'utf-8')
                msg.attach(html_part)
                
                with smtplib.SMTP(smtp_host, smtp_port) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_password)
                    server.send_message(msg)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': 'Вы успешно подписались! Приветственное письмо отправлено.'
                    }),
                    'isBase64Encoded': False
                }
            except Exception as e:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': f'Подписка оформлена, но письмо не отправлено: {str(e)}'
                    }),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Action not found'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
