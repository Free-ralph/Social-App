import requests
# from backend.models import RandomUsers

from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

# def fetchArticles():
#     url = "https://fake-users6.p.rapidapi.com/"

#     headers = {
#         "X-RapidAPI-Key": "1813829145msh833c644a187b3adp1038b5jsn079b91f9ceed",
#         "X-RapidAPI-Host": "fake-users6.p.rapidapi.com"
#     }

    
#     count = 0
#     while count < 200 :
#         response = requests.get(url, headers=headers)
#         user = response.json()["results"][0]
#         RandomUsers.objects.create(
#             username = user["login"]["username"], 
#             password = user["login"]["password"], 
#             name = f'{user["name"]["first"]} {user["name"]["last"]}'
#         )

#         count += 1
#     print("Successfull")


def compress_and_save_image(image, quality, *args, **kwargs):
    if image:
        img = Image.open(image)
        output = BytesIO()
        img.save(output, format='JPEG', quality=quality)  # Adjust quality as needed
        output.seek(0)
        image.save(image.name, InMemoryUploadedFile(
            output, 'ImageField', "%s.jpg" % image.name.split('.')[0], 'image/jpeg', sys.getsizeof(output), None), save=False )

        

        

