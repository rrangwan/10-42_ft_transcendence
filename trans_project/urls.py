from django.contrib import admin
from django.urls import path, include
from webapp.views import index, pong_game, games, register, user_profile, save_game_result, game_stats, pong_tour, pong_tour2, pong_game2, pong_AI, pong_AI2
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
    path('save_game_result/', save_game_result, name='save_game_result'),
    path('stats/', game_stats, name='stats'),
    path('pong2/', pong_tour, name='pong_tour'),
    path('pong4/', pong_game2, name='pong_game2'),
    path('pong5/', pong_tour2, name='pong_tour2'),
    path('pong6/', pong_AI, name='pong_AI'),
    path('pong7/', pong_AI2, name='pong_AI2'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
