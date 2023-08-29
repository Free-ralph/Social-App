import requests
from backend.models import RandomUsers
from django.contrib.auth.models import User

def fetchArticles():
    url = "https://fake-users6.p.rapidapi.com/"

    headers = {
        "X-RapidAPI-Key": "1813829145msh833c644a187b3adp1038b5jsn079b91f9ceed",
        "X-RapidAPI-Host": "fake-users6.p.rapidapi.com"
    }

    
    count = 0
    while count < 200 :
        response = requests.get(url, headers=headers)
        user = response.json()["results"][0]
        RandomUsers.objects.create(
            username = user["login"]["username"], 
            password = user["login"]["password"], 
            name = f'{user["name"]["first"]} {user["name"]["last"]}'
        )

        count += 1
    print("Successfull")

        

