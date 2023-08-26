from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.urls.conf import re_path
from django.views.static import serve
from django.views.generic import TemplateView
from django.conf.urls.static import static

urlpatterns = []

urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)


urlpatterns += [
    path('admin/', admin.site.urls),
    # re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),
    path('api/', include('backend.api.urls')),
    path('api/chat/', include('chat.api.urls')),
    re_path(r"^.*$", TemplateView.as_view(template_name="base.html")),
]
