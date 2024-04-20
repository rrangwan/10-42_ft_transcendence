from django.apps import AppConfig

class CustomProvidersConfig(AppConfig):
    name = 'custom_providers'

    def ready(self):
        import custom_providers.fortytwo.provider  # Import your custom provider
