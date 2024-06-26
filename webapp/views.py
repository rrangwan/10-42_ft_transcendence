from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from .forms import UserProfileForm, CustomUserCreationForm
from .models import UserProfile, Game, GAME_TYPE_CHOICES
from django.http import JsonResponse, HttpResponseRedirect
from django.utils import timezone
import pytz
import json
from django.utils.translation import activate
from django.utils.translation import gettext as _



@login_required
def set_language(request, language):
    response = HttpResponseRedirect(request.META.get('HTTP_REFERER', '/')) #returns to same page
    if request.user.is_authenticated:
        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.language = language
        user_profile.save()
        activate(language)  # Activate the selected language
    return response

# Home page view, accessible to everyone, no need to prevent caching here
def index(request):
    # Pass context about authentication status to the template
    context = {'is_authenticated': request.user.is_authenticated}
    return render(request, 'index.html', context)

# View for registering new users, should not be cached to prevent form resubmission
@never_cache
def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Log in the newly registered user
            return redirect('index')  # Redirect to index page after registration
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

# Game overview page, requires login and should not be cached
@login_required
@never_cache
def games(request):
    return render(request, 'games.html')

@login_required
@never_cache
def pong_game(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,  
    }
    return render(request, 'pong_game.html', context)

@login_required
@never_cache
def pong_game2(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,  
    }
    return render(request, 'pong_game2.html', context)

@login_required
@never_cache
def pong_tour(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,
    }
    return render(request, 'pong_tour.html', context)


@login_required
@never_cache
def pong_tour2(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,
    }
    return render(request, 'pong_tour2.html', context)

@login_required
@never_cache
def pong_AI(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,  
    }
    return render(request, 'pong_AI.html', context)

@login_required
@never_cache
def pong_AI2(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,  
    }
    return render(request, 'pong_AI2.html', context)


# User profile page, requires login and should not be cached
@login_required
@never_cache
def user_profile(request):
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=user_profile)
        if form.is_valid():
            form.save()
            return redirect('profile')  # Redirect back to the profile page after successful update
        else:
            # If the form is not valid, re-render the page with the form containing the errors
            return render(request, 'profile.html', {'form': form})
    else:
        form = UserProfileForm(instance=user_profile)
    return render(request, 'profile.html', {'form': form})


@login_required
@never_cache
def save_game_result(request):
    
    timezone.activate(pytz.timezone('Etc/GMT-4'))

    if request.method == "POST":
        user_profile = UserProfile.objects.get(user=request.user)  # Ensure the user profile is obtained from the logged-in user
        game_result = request.POST.get('result')
        game_type = request.POST.get('game_type')  
        game_type = int(game_type)
        new_game = Game(
            user_profile=user_profile,
            game_type=game_type, 
            game_result=game_result,
            date_time=timezone.now()  
        )
        new_game.save()

        return JsonResponse({"message": "Game result saved successfully!"}, status=200)


@login_required
@never_cache
def game_stats(request):
    games = Game.objects.filter(user_profile__user=request.user).order_by('-date_time')
    game_types = dict(GAME_TYPE_CHOICES)  # Maps game type IDs to names

    games_by_type = {}
    stats_by_type = {}
    for type_id, type_name in game_types.items():
        filtered_games = games.filter(game_type=type_id)
        games_by_type[type_name] = filtered_games
        # Adjust string comparisons to match case
        wins = filtered_games.filter(game_result='Win').count()
        losses = filtered_games.filter(game_result='Lose').count()
        draws = filtered_games.filter(game_result='Draw').count()
        stats_by_type[type_name] = {'wins': wins, 'losses': losses, 'draws': draws}

    # Prepare the chart data for the JavaScript to create the charts
    chart_data = json.dumps([
        {'typeName': type_name, 'wins': stats['wins'], 'losses': stats['losses'], 'draws': stats['draws']}
        for type_name, stats in stats_by_type.items()
    ])

    return render(request, 'stats.html', {'games_by_type': games_by_type, 'chart_data': chart_data})
    

@login_required
@never_cache
def tic_game(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,  
    }
    return render(request, 'tic_game.html', context)

@login_required
@never_cache
def tic_game2(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,  
    }
    return render(request, 'tic_game2.html', context)

@login_required
@never_cache
def tic_tour(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,
    }
    return render(request, 'tic_tour.html', context)


@login_required
@never_cache
def tic_tour2(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,
    }
    return render(request, 'tic_tour2.html', context)

@login_required
@never_cache
def tic_AI(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,  
    }
    return render(request, 'tic_AI.html', context)

@login_required
@never_cache
def tic_AI2(request):
    user_profile = UserProfile.objects.get(user=request.user)
    context = {
        'nickname': user_profile.nickname,  
    }
    return render(request, 'tic_AI2.html', context)
