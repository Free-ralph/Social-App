from .base import *
import dj_database_url
ALLOWED_HOSTS = []

DATABASES = {  
    'default': dj_database_url.config(
        default=config('DB_URL')
    )
}