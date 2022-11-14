import json
from random import random
import requests

res=requests.post("http://localhost:5000/app/register", data={"name":"test"+random().__str__()},headers={"x-admin-id":"admin"})
obj=json.loads(res.text)
print(res.text)
res=requests.post("http://localhost:5000/users/register", data={"username":"imran"},headers={"x-app-id":obj['appId']})
print(res.text)
#res=requests.post("http://localhost:5000/users/authenticate", data={"username":"imran"},headers={"x-app-id":obj['appId']})
print(res.text)