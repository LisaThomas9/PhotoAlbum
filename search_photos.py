import boto3
from elasticsearch import Elasticsearch

#es = Elasticsearch()
client = boto3.client('lex-runtime')

def lambda_handler(event, context):
    
    search_string = event['q']
    print(search_string)
    
    response = client.post_text(
                botName='SearchPhotos',
                botAlias='v_one',
                userId='u007',
                inputText=search_string
                )
                
    print(response)
    
    
    #get slot values from response
    item_1 = response['slots']['item_one'] 
    item_2 = response['slots']['item_two']
    
    res = []
    if item_1 and item_2:
        items = []
        if item_1:
            items.append(item_1)
        if item_2:
            items.append(item_2)
        
        print(items)
        image_list = []
        
        es = Elasticsearch("https://vpc-photos-5ix5xyrrkgsaszanuaxcz5clfe.us-east-1.es.amazonaws.com", verify_certs=False)
        
        data = es.search(index="photos", body={"query": {"terms": {"labels": items}}})
        
        print(data)
        
        for hit in data['hits']['hits']:
            print(hit['_source']['objectKey'])
            image_list.append(hit['_source']['objectKey'])
            
        
        prefix_url = "https://s3.amazonaws.com/b2photos/"
        for i in image_list:
            d = {}
            url = prefix_url + i
            d["url"] = url
            d["labels"] = []
            res.append(d)
       
    return {
        "results" : res
    }

    
    
