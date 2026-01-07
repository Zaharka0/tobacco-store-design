import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request

def get_bot_config(cur):
    '''Получить настройки и сообщения бота из БД'''
    cur.execute('SELECT setting_key, setting_value FROM bot_settings')
    settings = {row['setting_key']: row['setting_value'] for row in cur.fetchall()}
    
    cur.execute('SELECT message_key, message_text FROM bot_messages')
    messages = {row['message_key']: row['message_text'] for row in cur.fetchall()}
    
    return settings, messages

def send_telegram_message(bot_token: str, chat_id: str, text: str, reply_markup=None):
    '''Отправить сообщение через Telegram Bot API'''
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
    data = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML'
    }
    
    if reply_markup:
        data['reply_markup'] = json.dumps(reply_markup)
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def get_products_list(cur):
    '''Получить список продуктов по категориям'''
    cur.execute('''
        SELECT category, COUNT(*) as count 
        FROM products 
        WHERE in_stock = true 
        GROUP BY category
    ''')
    return cur.fetchall()

def get_cart_items(cur, cart_id: int):
    '''Получить товары из корзины'''
    cur.execute('''
        SELECT product_name, product_price, quantity, 
               (product_price * quantity) as total
        FROM cart_items 
        WHERE cart_id = %s AND quantity > 0
    ''', (cart_id,))
    return cur.fetchall()

def handle_webhook(event: dict, cur, conn):
    '''Обработка webhook от Telegram'''
    settings, messages = get_bot_config(cur)
    
    if settings.get('bot_enabled') != 'true':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'status': 'bot disabled'}),
            'isBase64Encoded': False
        }
    
    bot_token = settings.get('bot_token', '')
    if not bot_token:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Bot token not configured'}),
            'isBase64Encoded': False
        }
    
    update = json.loads(event.get('body', '{}'))
    
    if 'message' in update:
        message = update['message']
        chat_id = message['chat']['id']
        text = message.get('text', '')
        
        if text.startswith('/start'):
            parts = text.split('_')
            if len(parts) > 1 and parts[0] == '/start order':
                cart_id = int(parts[1])
                items = get_cart_items(cur, cart_id)
                
                if items:
                    order_text = "🛒 <b>Ваш заказ:</b>\n\n"
                    total = 0
                    for item in items:
                        order_text += f"• {item['product_name']} x{item['quantity']} = {item['total']}₽\n"
                        total += item['total']
                    
                    order_text += f"\n💰 <b>Итого: {total}₽</b>\n\n"
                    order_text += "Для оформления заказа свяжитесь с менеджером"
                    
                    keyboard = {
                        'inline_keyboard': [
                            [{'text': '💬 Связаться с менеджером', 'url': f'https://t.me/{settings.get("admin_username", "whiteshishka")}'}]
                        ]
                    }
                    
                    send_telegram_message(bot_token, chat_id, order_text, keyboard)
                    
                    cur.execute('UPDATE carts SET telegram_user_id = %s WHERE id = %s', (str(chat_id), cart_id))
                    conn.commit()
                else:
                    send_telegram_message(bot_token, chat_id, "Корзина пуста")
            else:
                welcome_text = messages.get('welcome', 'Привет!')
                send_telegram_message(bot_token, chat_id, welcome_text)
        
        elif text == '/help':
            help_text = messages.get('help', 'Доступные команды:\n/start\n/catalog\n/help')
            send_telegram_message(bot_token, chat_id, help_text)
        
        elif text == '/catalog':
            products = get_products_list(cur)
            
            catalog_text = messages.get('catalog_intro', '📦 Наш каталог:') + '\n\n'
            for product in products:
                catalog_text += f"• {product['category']}: {product['count']} товаров\n"
            
            keyboard = {
                'inline_keyboard': [
                    [{'text': '🌐 Открыть каталог', 'url': 'https://whiteshishka.com'}]
                ]
            }
            
            send_telegram_message(bot_token, chat_id, catalog_text, keyboard)
        
        else:
            send_telegram_message(bot_token, chat_id, 'Используйте /help для списка команд')
        
        admin_chat_id = settings.get('admin_chat_id', '')
        if admin_chat_id:
            admin_text = f"💬 Новое сообщение от пользователя {chat_id}:\n{text}"
            send_telegram_message(bot_token, admin_chat_id, admin_text)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True}),
        'isBase64Encoded': False
    }

def handler(event: dict, context) -> dict:
    '''API для управления настройками телеграм-бота и webhook для приема сообщений'''
    method = event.get('httpMethod', 'GET')
    path = event.get('queryStringParameters', {}).get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            raise Exception('DATABASE_URL not configured')
        
        conn = psycopg2.connect(dsn)
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            
            if method == 'POST' and path != 'webhook':
                return handle_webhook(event, cur, conn)
            
            if method == 'GET':
                cur.execute('SELECT * FROM bot_settings ORDER BY setting_key')
                settings = cur.fetchall()
                
                cur.execute('SELECT * FROM bot_messages ORDER BY message_key')
                messages = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'settings': [dict(row) for row in settings],
                        'messages': [dict(row) for row in messages]
                    }, default=str),
                    'isBase64Encoded': False
                }
            
            elif method == 'PUT':
                body = json.loads(event.get('body', '{}'))
                settings = body.get('settings', [])
                messages = body.get('messages', [])
                
                for setting in settings:
                    cur.execute(
                        '''UPDATE bot_settings 
                           SET setting_value = %s, updated_at = CURRENT_TIMESTAMP 
                           WHERE setting_key = %s''',
                        (setting['setting_value'], setting['setting_key'])
                    )
                
                for message in messages:
                    cur.execute(
                        '''UPDATE bot_messages 
                           SET message_text = %s, updated_at = CURRENT_TIMESTAMP 
                           WHERE message_key = %s''',
                        (message['message_text'], message['message_key'])
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            conn.close()