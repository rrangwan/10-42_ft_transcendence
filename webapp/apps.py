from django.apps import AppConfig


class WebappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'webapp'

class CustomProvidersConfig(AppConfig):
    name = 'custom_providers'

    def ready(self):
        import custom_providers.fortytwo.provider
