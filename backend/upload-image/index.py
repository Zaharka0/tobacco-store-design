import json
import os
import base64
import uuid
import boto3
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для загрузки изображений товаров на S3'''
    
    method = event.get('httpMethod', 'POST')
    
    # CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        data = json.loads(event.get('body', '{}'))
        base64_image = data.get('image', '')
        
        if not base64_image or not base64_image.startswith('data:image/'):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid image format'}),
                'isBase64Encoded': False
            }
        
        # Извлечь MIME тип и данные
        header, encoded = base64_image.split(',', 1)
        mime_type = header.split(':')[1].split(';')[0]
        extension = mime_type.split('/')[1]
        
        # Декодировать base64
        image_data = base64.b64decode(encoded)
        
        # Генерировать уникальное имя файла
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"products/{timestamp}_{uuid.uuid4().hex[:8]}.{extension}"
        
        # Загрузить на S3
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        s3.put_object(
            Bucket='files',
            Key=filename,
            Body=image_data,
            ContentType=mime_type
        )
        
        # Сформировать CDN URL
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{filename}"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'url': cdn_url}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
