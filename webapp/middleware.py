from django.utils.translation import activate
from .models import UserProfile

class LanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Default language
        user_language = 'en'

        # Check if the user is authenticated
        if request.user.is_authenticated:
            # Retrieve the user's profile
            user_profile = UserProfile.objects.filter(user=request.user).first()
            if user_profile and user_profile.language:
                # Set the user's preferred language from their profile
                user_language = user_profile.language

        # Activate the user's preferred language
        activate(user_language)

        # Continue processing the request
        response = self.get_response(request)
        return response
