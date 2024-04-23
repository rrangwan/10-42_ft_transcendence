from django.contrib import admin
from django.urls import path, include
from webapp.views import index, pong_game, games, register, user_profile
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', auth_views.LoginView.as_view(template_name='login.html', redirect_authenticated_user=True), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='index'), name='logout'),
    path('register/', register, name='register'),
    path('', index, name='index'),  # Home page
    path('games/', games, name='games'),
    path('pong/', pong_game, name='pong_game'),
    path('profile/', user_profile, name='profile'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
