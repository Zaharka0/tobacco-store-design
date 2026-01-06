import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления контентом страниц сайта"""
    
    method = event.get('httpMethod', 'GET')
    
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
            raise Exception('DATABASE_URL not configured')
        
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            page_name = event.get('queryStringParameters', {}).get('page')
            
            if page_name:
                cursor.execute(
                    'SELECT * FROM page_content WHERE page_name = %s ORDER BY display_order',
                    (page_name,)
                )
            else:
                cursor.execute('SELECT * FROM page_content ORDER BY page_name, display_order')
            
            results = cursor.fetchall()
            
            content_list = []
            for row in results:
                item = dict(row)
                if item.get('content_json'):
                    item['content'] = item['content_json']
                else:
                    item['content'] = item.get('content_text', '')
                del item['content_json']
                del item['content_text']
                content_list.append(item)
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(content_list, ensure_ascii=False, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            content_id = event.get('queryStringParameters', {}).get('id')
            if not content_id:
                raise Exception('Content ID required')
            
            body = json.loads(event.get('body', '{}'))
            content = body.get('content')
            is_visible = body.get('is_visible', True)
            
            if isinstance(content, (dict, list)):
                cursor.execute(
                    'UPDATE page_content SET content_json = %s, content_text = NULL, is_visible = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s',
                    (json.dumps(content, ensure_ascii=False), is_visible, content_id)
                )
            else:
                cursor.execute(
                    'UPDATE page_content SET content_text = %s, content_json = NULL, is_visible = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s',
                    (str(content), is_visible, content_id)
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
                'body': json.dumps({'success': True, 'message': 'Content updated'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            content_id = event.get('queryStringParameters', {}).get('id')
            if not content_id:
                raise Exception('Content ID required')
            
            cursor.execute('UPDATE page_content SET is_visible = false WHERE id = %s', (content_id,))
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Content hidden'}),
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
