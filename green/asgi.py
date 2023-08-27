import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from chat.routing import websocket_urlpatterns
from decouple import config

DEBUG = config('DEBUG').lower() in ('true', 't', '1')

if DEBUG:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'green.settings.dev')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'green.settings.prod')

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
    }
)
