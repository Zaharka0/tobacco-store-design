import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления контентом сайта, аналитикой и заказами"""
    
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
        
        if action == 'analytics-stats' and method == 'GET':
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_views,
                    COUNT(DISTINCT user_ip) as unique_visitors,
                    COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as views_today,
                    COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as views_week
                FROM page_views
            """)
            stats = cursor.fetchone()
            
            cursor.execute("""
                SELECT page_url, COUNT(*) as views
                FROM page_views
                GROUP BY page_url
                ORDER BY views DESC
                LIMIT 10
            """)
            top_pages = cursor.fetchall()
            
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_orders,
                    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_orders,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
                    COALESCE(SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END), 0) as total_revenue
                FROM orders
            """)
            orders_stats = cursor.fetchone()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'views': {
                        'total': stats['total_views'],
                        'unique': stats['unique_visitors'],
                        'today': stats['views_today'],
                        'week': stats['views_week']
                    },
                    'top_pages': [{'page': row['page_url'], 'views': row['views']} for row in top_pages],
                    'orders': {
                        'total': orders_stats['total_orders'],
                        'new': orders_stats['new_orders'],
                        'completed': orders_stats['completed_orders'],
                        'revenue': float(orders_stats['total_revenue'])
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'analytics-track' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            page_url = body.get('page_url', '/')
            user_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', '')
            user_agent = event.get('headers', {}).get('user-agent', '')
            referrer = body.get('referrer', '')
            
            cursor.execute(
                "INSERT INTO page_views (page_url, user_ip, user_agent, referrer) VALUES (%s, %s, %s, %s)",
                (page_url, user_ip, user_agent, referrer)
            )
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif action == 'orders' and method == 'GET':
            cursor.execute("""
                SELECT id, user_name, user_phone, user_email, product_name, 
                       product_price, quantity, total_price, status, notes, created_at
                FROM orders
                ORDER BY created_at DESC
                LIMIT 100
            """)
            orders = cursor.fetchall()
            cursor.close()
            conn.close()
            
            orders_list = []
            for order in orders:
                orders_list.append({
                    'id': order['id'],
                    'user_name': order['user_name'],
                    'user_phone': order['user_phone'],
                    'user_email': order['user_email'],
                    'product_name': order['product_name'],
                    'product_price': float(order['product_price']),
                    'quantity': order['quantity'],
                    'total_price': float(order['total_price']),
                    'status': order['status'],
                    'notes': order['notes'],
                    'created_at': order['created_at'].isoformat() if order['created_at'] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'orders': orders_list}),
                'isBase64Encoded': False
            }
        
        elif action == 'order' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cursor.execute("""
                INSERT INTO orders (user_name, user_phone, user_email, product_name, 
                                    product_price, quantity, total_price, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                body.get('user_name'),
                body.get('user_phone'),
                body.get('user_email'),
                body.get('product_name'),
                body.get('product_price'),
                body.get('quantity', 1),
                body.get('total_price'),
                body.get('notes', '')
            ))
            order_id = cursor.fetchone()['id']
            conn.commit()
            
            cursor.execute("""
                INSERT INTO admin_notifications (title, message, type, link)
                VALUES (%s, %s, %s, %s)
            """, (
                'Новый заказ',
                f"Заказ #{order_id} от {body.get('user_name')} на {body.get('total_price')} ₽",
                'order',
                f'/admin/orders/{order_id}'
            ))
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'order_id': order_id}),
                'isBase64Encoded': False
            }
        
        elif action == 'order-status' and method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            order_id = body.get('id')
            status = body.get('status')
            
            cursor.execute(
                "UPDATE orders SET status = %s, updated_at = NOW() WHERE id = %s",
                (status, order_id)
            )
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif action == 'notifications' and method == 'GET':
            cursor.execute("""
                SELECT id, title, message, type, is_read, link, created_at
                FROM admin_notifications
                ORDER BY created_at DESC
                LIMIT 50
            """)
            notifications = cursor.fetchall()
            cursor.close()
            conn.close()
            
            notif_list = []
            for notif in notifications:
                notif_list.append({
                    'id': notif['id'],
                    'title': notif['title'],
                    'message': notif['message'],
                    'type': notif['type'],
                    'is_read': notif['is_read'],
                    'link': notif['link'],
                    'created_at': notif['created_at'].isoformat() if notif['created_at'] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'notifications': notif_list}),
                'isBase64Encoded': False
            }
        
        elif action == 'notification-read' and method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            notif_id = body.get('id')
            
            cursor.execute(
                "UPDATE admin_notifications SET is_read = TRUE WHERE id = %s",
                (notif_id,)
            )
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif action == 'cart' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_phone = body.get('user_phone')
            session_id = body.get('session_id', '')
            
            cursor.execute(
                "SELECT id FROM carts WHERE user_phone = %s AND status = 'active' ORDER BY created_at DESC LIMIT 1",
                (user_phone,)
            )
            cart = cursor.fetchone()
            
            if not cart:
                cursor.execute(
                    "INSERT INTO carts (user_phone, session_id, status) VALUES (%s, %s, 'active') RETURNING id",
                    (user_phone, session_id)
                )
                cart_id = cursor.fetchone()['id']
            else:
                cart_id = cart['id']
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'cart_id': cart_id}),
                'isBase64Encoded': False
            }
        
        elif action == 'cart-item' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            cart_id = body.get('cart_id')
            product_id = body.get('product_id')
            product_name = body.get('product_name')
            product_price = body.get('product_price')
            quantity = body.get('quantity', 1)
            
            cursor.execute(
                "SELECT id, quantity FROM cart_items WHERE cart_id = %s AND product_id = %s",
                (cart_id, product_id)
            )
            existing = cursor.fetchone()
            
            if existing:
                cursor.execute(
                    "UPDATE cart_items SET quantity = quantity + %s WHERE id = %s",
                    (quantity, existing['id'])
                )
            else:
                cursor.execute(
                    "INSERT INTO cart_items (cart_id, product_id, product_name, product_price, quantity) VALUES (%s, %s, %s, %s, %s)",
                    (cart_id, product_id, product_name, product_price, quantity)
                )
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif action == 'cart-items' and method == 'GET':
            query_params = event.get('queryStringParameters', {})
            cart_id = query_params.get('cart_id') if query_params else None
            
            if not cart_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'cart_id required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                SELECT id, product_id, product_name, product_price, quantity
                FROM cart_items
                WHERE cart_id = %s
            """, (cart_id,))
            items = cursor.fetchall()
            cursor.close()
            conn.close()
            
            items_list = []
            total = 0
            for item in items:
                item_total = float(item['product_price']) * item['quantity']
                total += item_total
                items_list.append({
                    'id': item['id'],
                    'product_id': item['product_id'],
                    'product_name': item['product_name'],
                    'product_price': float(item['product_price']),
                    'quantity': item['quantity'],
                    'total': item_total
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'items': items_list, 'total': total}),
                'isBase64Encoded': False
            }
        
        elif action == 'cart-item-remove' and method == 'DELETE':
            query_params = event.get('queryStringParameters', {})
            item_id = query_params.get('item_id') if query_params else None
            
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'item_id required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("DELETE FROM cart_items WHERE id = %s", (item_id,))
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif action == 'cart-checkout' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            cart_id = body.get('cart_id')
            telegram_user_id = body.get('telegram_user_id')
            
            cursor.execute(
                "UPDATE carts SET status = 'checkout', telegram_user_id = %s WHERE id = %s",
                (telegram_user_id, cart_id)
            )
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            section = event.get('queryStringParameters', {}).get('section') if event.get('queryStringParameters') else None
            
            if section:
                cursor.execute(
                    'SELECT content_key, content_value, section, description FROM site_content WHERE section = %s ORDER BY content_key',
                    (section,)
                )
            else:
                cursor.execute('SELECT content_key, content_value, section, description FROM site_content ORDER BY section, content_key')
            
            results = cursor.fetchall()
            
            content_dict = {}
            for row in results:
                content_dict[row['content_key']] = {
                    'value': row['content_value'],
                    'section': row['section'],
                    'description': row['description']
                }
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(content_dict, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            
            for content_key, content_value in body.items():
                cursor.execute(
                    'UPDATE site_content SET content_value = %s, updated_at = CURRENT_TIMESTAMP WHERE content_key = %s',
                    (content_value, content_key)
                )
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Content updated', 'updated_keys': len(body)}),
                'isBase64Encoded': False
            }
        
        else:
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