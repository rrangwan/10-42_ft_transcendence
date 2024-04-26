from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from .forms import UserProfileForm, CustomUserCreationForm
from .models import UserProfile, Game, GAME_TYPE_CHOICES
from django.http import JsonResponse
from django.utils import timezone


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
        'nickname': user_profile.nickname,  # This is the nickname from the user's profile
    }
    return render(request, 'pong_game.html', context)

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
    if request.method == "POST":
        user_profile = UserProfile.objects.get(user=request.user)  # Get the user profile from the logged-in user
        game_result = request.POST.get('result')

        new_game = Game(
            user_profile=user_profile,
            game_type=1,
            game_result=game_result,
            date_time=timezone.now()
        )
        new_game.save()

        return JsonResponse({"message": "Game result saved successfully!"}, status=200)


@login_required
@never_cache
def game_stats(request):
    games = Game.objects.filter(user_profile__user=request.user).order_by('-date_time')
    game_types = dict(GAME_TYPE_CHOICES)  # This maps game type IDs to names

    # Organize games by type and include the name directly
    games_by_type = {}
    for type_id, type_name in game_types.items():
        games_by_type[type_name] = [game for game in games if game.game_type == type_id]

    return render(request, 'stats.html', {'games_by_type': games_by_type})