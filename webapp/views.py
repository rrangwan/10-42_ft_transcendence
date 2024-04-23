from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from .forms import UserProfileForm, CustomUserCreationForm
from .models import UserProfile

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
