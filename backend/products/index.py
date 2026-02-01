import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для управления товарами магазина, акциями и email-рассылкой'''
    
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'products')
    
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
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    try:
        # Управление акциями
        if action == 'promotions':
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
        
        # Подписка на рассылку
        elif action == 'newsletter-subscribe' and method == 'POST':
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
        
        # Управление товарами
        if method == 'GET':
            product_id = params.get('id')
            
            if product_id:
                # Получить один товар
                cursor.execute(f'SELECT * FROM {schema}.products WHERE id = %s', (product_id,))
                product = cursor.fetchone()
                
                if not product:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Товар не найден'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(product), ensure_ascii=False)
                }
            else:
                # Получить все товары
                category = params.get('category')
                
                if category:
                    cursor.execute(f'SELECT * FROM {schema}.products WHERE category = %s ORDER BY created_at DESC', (category,))
                else:
                    cursor.execute(f'SELECT * FROM {schema}.products ORDER BY created_at DESC')
                
                products = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(p) for p in products], ensure_ascii=False, default=str)
                }
        
        elif method == 'POST':
            # Создать новый товар
            data = json.loads(event.get('body', '{}'))
            
            cursor.execute(f'''
                INSERT INTO {schema}.products 
                (name, price, category, image_url, short_description, full_description, features, in_stock, is_new, discount)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            ''', (
                data['name'],
                data['price'],
                data['category'],
                data.get('image_url', '/placeholder.svg'),
                data.get('short_description', ''),
                data.get('full_description', ''),
                json.dumps(data.get('features', {})),
                data.get('in_stock', True),
                data.get('is_new', False),
                data.get('discount', 0)
            ))
            
            product = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(product), ensure_ascii=False, default=str)
            }
        
        elif method == 'PUT':
            # Обновить товар
            data = json.loads(event.get('body', '{}'))
            params = event.get('queryStringParameters') or {}
            product_id = params.get('id') or data.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указан ID товара'})
                }
            
            cursor.execute(f'''
                UPDATE {schema}.products 
                SET name = %s, price = %s, category = %s, image_url = %s, 
                    short_description = %s, full_description = %s, features = %s,
                    in_stock = %s, is_new = %s, discount = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            ''', (
                data['name'],
                data['price'],
                data['category'],
                data.get('image_url', '/placeholder.svg'),
                data.get('short_description', ''),
                data.get('full_description', ''),
                json.dumps(data.get('features', {})),
                data.get('in_stock', True),
                data.get('is_new', False),
                data.get('discount', 0),
                product_id
            ))
            
            product = cursor.fetchone()
            conn.commit()
            
            if not product:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Товар не найден'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(product), ensure_ascii=False, default=str)
            }
        
        elif method == 'DELETE':
            # Удалить товар
            params = event.get('queryStringParameters') or {}
            product_id = params.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указан ID товара'})
                }
            
            cursor.execute(f'DELETE FROM {schema}.products WHERE id = %s RETURNING id', (product_id,))
            deleted = cursor.fetchone()
            conn.commit()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Товар не найден'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Товар удален'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    finally:
        cursor.close()
        conn.close()