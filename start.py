# '#####' path to the file on local disk 

import boto3
import json

reko = boto3.client('rekognition')

pic = '#####.jpg'   

in_file = open(pic, "rb") 
pic_binary = in_file.read() # if you only wanted to read 512 bytes, do .read(512)
in_file.close()

response_binary = reko.detect_faces(
	Image={
        'Bytes': pic_binary
    },
    Attributes=[
        'ALL',
    ]
)

with open("#####.json", 'w') as f:
    json.dump(response_binary, f)
