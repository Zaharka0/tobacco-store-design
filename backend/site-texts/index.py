import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления всеми текстами сайта"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
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
            section = event.get('queryStringParameters', {}).get('section') if event.get('queryStringParameters') else None
            
            if section:
                cursor.execute(
                    'SELECT text_key, text_value, section, description FROM site_texts WHERE section = %s ORDER BY text_key',
                    (section,)
                )
            else:
                cursor.execute('SELECT text_key, text_value, section, description FROM site_texts ORDER BY section, text_key')
            
            results = cursor.fetchall()
            
            texts_dict = {}
            for row in results:
                texts_dict[row['text_key']] = {
                    'value': row['text_value'],
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
                'body': json.dumps(texts_dict, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            
            updated_count = 0
            for text_key, text_value in body.items():
                cursor.execute(
                    'UPDATE site_texts SET text_value = %s, updated_at = CURRENT_TIMESTAMP WHERE text_key = %s',
                    (text_value, text_key)
                )
                updated_count += cursor.rowcount
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Texts updated', 'updated_count': updated_count}),
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
