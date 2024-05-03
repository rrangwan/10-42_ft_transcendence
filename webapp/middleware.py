
from django.utils.translation import activate
from .models import UserProfile

class LanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user_language = 'en'  # default language
        if request.user.is_authenticated:
            user_profile = UserProfile.objects.filter(user=request.user).first()
            if user_profile and user_profile.language:
                user_language = user_profile.language
        activate(user_language)
        response = self.get_response(request)
        return response
