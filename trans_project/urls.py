from django.contrib import admin
from django.urls import path, include
from webapp.views import index, pong_game, games, register, user_profile, save_game_result, game_stats, pong_tour, pong_tour2, pong_game2, pong_AI, pong_AI2, set_language, tic_game, tic_game2, tic_tour, tic_tour2, tic_AI, tic_AI2
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
    path('pong3/', pong_game2, name='pong_game2'),
    path('pong4/', pong_tour2, name='pong_tour2'),
    path('pong5/', pong_AI, name='pong_AI'),
    path('pong6/', pong_AI2, name='pong_AI2'),
    path('tic/', tic_game, name='tic_game'),
    path('tic2/', tic_game2, name='tic_game2'),
    path('tic3/', tic_tour, name='tic_tour'),
    path('tic4/', tic_tour2, name='tic_tour2'),
    path('tic5/', tic_AI, name='tic_AI'),
    path('tic6/', tic_AI2, name='tic_AI2'),
    path('set-language/<str:lang_code>/', set_language, name='set_language'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
