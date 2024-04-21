# URL configuration for trans_project project.

# For more information please see:
# https://docs.djangoproject.com/en/5.0/topics/http/urls/

from django.contrib import admin
from django.urls import path, include  
from webapp.views import index
from webapp.views import pong_game 

urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('pong/', pong_game, name='pong_game'),
]

