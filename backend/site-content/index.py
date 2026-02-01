import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from email_service import send_welcome_email, send_email

def handler(event: dict, context) -> dict:
    """API для управления контентом сайта, аналитикой, заказами и email-рассылкой"""
    
    method = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    path_params = event.get('pathParams', {}) or {}
    action = query_params.get('action') or path_params.get('action', 'content')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            raise Exception('DATABASE_URL not configured')
        
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'test-email' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            test_email = body.get('email', '')
            
            if not test_email:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email не указан'}),
                    'isBase64Encoded': False
                }
            
            cursor.close()
            conn.close()
            
            try:
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
                
                send_email(test_email, 'Тестовое письмо', '<h2>Тест успешен!</h2><p>SMTP настроен правильно, письма работают.</p>')
                
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
        
        elif action == 'newsletter-subscribe' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            email = body.get('email', '').strip()
            
            if not email or '@' not in email:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Некорректный email адрес'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                INSERT INTO newsletter_subscribers (email, subscribed_at, active)
                VALUES (%s, NOW(), true)
                ON CONFLICT (email) 
                DO UPDATE SET active = true, subscribed_at = NOW()
                RETURNING id
            ''', (email,))
            
            subscriber_id = cursor.fetchone()['id']
            conn.commit()
            cursor.close()
            conn.close()
            
            try:
                send_welcome_email(email)
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
        
        elif action == 'newsletter-send' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            subject = body.get('subject', '')
            content = body.get('content', '')
            
            cursor.execute('SELECT email FROM newsletter_subscribers WHERE active = true')
            subscribers = cursor.fetchall()
            cursor.close()
            conn.close()
            
            sent_count = 0
            failed_count = 0
            errors = []
            
            for row in subscribers:
                try:
                    send_email(row['email'], subject, content)
                    sent_count += 1
                except Exception as e:
                    failed_count += 1
                    errors.append(f"{row['email']}: {str(e)}")
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'sent': sent_count,
                    'failed': failed_count,
                    'total': len(subscribers),
                    'errors': errors[:5] if errors else []
                }),
                'isBase64Encoded': False
            }
        
        cursor.close()
        conn.close()
        
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
