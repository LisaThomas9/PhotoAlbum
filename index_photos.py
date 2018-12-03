import json
import boto3
import botocore.config
import datetime as dt
from elasticsearch import Elasticsearch

client=boto3.client('rekognition')
#client1 = boto3.client('rekognition', 'us-east-1', config=botocore.config.Config(s3={'addressing_style':'path'}))

def lambda_handler(event, context):
    
    bucket = 'b2photos'
    photo = event['Records'][0]['s3']['object']['key']
    print("Photo name: ",photo)
    #photo = "columbia.jpg" 

    
    response = client.detect_labels(
                    Image={
                        'S3Object':{
                            'Bucket':bucket,
                            'Name':photo
                            }
                        },
        MaxLabels=10)
    
    labels = []
    for label in response['Labels']:
        print(label['Name'])
        labels.append(label['Name'])
      
    now = dt.datetime.now()
    ts = now.strftime("%Y-%m-%d %H:%M:%S")
    
    body = {
        'objectKey': photo,
        'bucket': bucket,
        'createdTimestamp': ts,
        'labels': labels
    }
    
    #put stuff into ES
    
    es = Elasticsearch("https://vpc-photos-5ix5xyrrkgsaszanuaxcz5clfe.us-east-1.es.amazonaws.com", verify_certs=False)
   
    res = es.index(index="photos", doc_type='meta', body=body)
    print(res['result'])
    
