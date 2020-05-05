import boto3
import json
import sys

reko = boto3.client('rekognition')

pic =  str(sys.argv[1]) 
pic_w_ext = pic[:-4]
pic_json = pic_w_ext+".json" 

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

with open(pic_json, 'w') as f:
    json.dump(response_binary, f)
