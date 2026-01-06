import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления текстовым контентом сайта (все надписи и тексты)"""
    
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
