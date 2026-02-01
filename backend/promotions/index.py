import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для управления акциями и email-рассылкой.'''
    
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'promotions')
    
    # CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Подключение к БД
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Подписка на рассылку
        if action == 'newsletter-subscribe' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            email = body.get('email', '').strip()
            if not email or '@' not in email:
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
            conn.commit()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Вы успешно подписались на рассылку!'}),
                'isBase64Encoded': False
            }
        
        # Управление акциями
        if method == 'GET':
            promo_id = params.get('id')
            if promo_id:
                cursor.execute('SELECT * FROM promotions WHERE id = %s', (promo_id,))
                promo = cursor.fetchone()
                if not promo:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Акция не найдена'}),
                        'isBase64Encoded': False
                    }
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(promo), ensure_ascii=False, default=str),
                    'isBase64Encoded': False
                }
            else:
                cursor.execute('SELECT * FROM promotions ORDER BY created_at DESC')
                promos = cursor.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(p) for p in promos], ensure_ascii=False, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            cursor.execute('''
                INSERT INTO promotions 
                (title, description, discount, image_url, valid_until, is_active)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
            ''', (
                body['title'],
                body.get('description', ''),
                body.get('discount', ''),
                body.get('image_url', '/placeholder.svg'),
                body.get('valid_until', ''),
                body.get('is_active', True)
            ))
            promo = cursor.fetchone()
            conn.commit()
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(promo), ensure_ascii=False, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            promo_id = params.get('id') or body.get('id')
            if not promo_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указан ID акции'}),
                    'isBase64Encoded': False
                }
            cursor.execute('''
                UPDATE promotions 
                SET title = %s, description = %s, discount = %s, image_url = %s, 
                    valid_until = %s, is_active = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            ''', (
                body['title'],
                body.get('description', ''),
                body.get('discount', ''),
                body.get('image_url', '/placeholder.svg'),
                body.get('valid_until', ''),
                body.get('is_active', True),
                promo_id
            ))
            promo = cursor.fetchone()
            conn.commit()
            if not promo:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Акция не найдена'}),
                    'isBase64Encoded': False
                }
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(promo), ensure_ascii=False, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            promo_id = params.get('id')
            if not promo_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указан ID акции'}),
                    'isBase64Encoded': False
                }
            cursor.execute('DELETE FROM promotions WHERE id = %s RETURNING id', (promo_id,))
            deleted = cursor.fetchone()
            conn.commit()
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Акция не найдена'}),
                    'isBase64Encoded': False
                }
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Акция удалена'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
