# URL configuration for trans_project project.

# For more information please see:
# https://docs.djangoproject.com/en/5.0/topics/http/urls/

from django.contrib import admin
from django.urls import path, include  # Make sure to include the 'include' function
from django.urls import path
from webapp.views import home

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    # Your other URLs...
]

