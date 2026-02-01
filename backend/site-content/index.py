import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления уведомлениями, аналитикой и заказами"""
    
    method = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    action = query_params.get('action', 'notifications')
    
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
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'notifications': []}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'notifications' and method == 'GET':
            try:
                cursor.execute("""
                    SELECT id, title, message, type, is_read, link, created_at
                    FROM admin_notifications
                    ORDER BY created_at DESC
                    LIMIT 50
                """)
                notifications = cursor.fetchall()
            except psycopg2.Error:
                notifications = []
            
            notif_list = []
            for notif in notifications:
                notif_list.append({
                    'id': notif['id'],
                    'title': notif['title'],
                    'message': notif['message'],
                    'type': notif['type'],
                    'is_read': notif['is_read'],
                    'link': notif['link'],
                    'created_at': notif['created_at'].isoformat() if notif.get('created_at') else None
                })
            
            cursor.close()
            conn.close()
            
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
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e), 'notifications': []}),
            'isBase64Encoded': False
        }
