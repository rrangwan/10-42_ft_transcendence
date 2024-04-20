from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider

class FortyTwoProvider(OAuth2Provider):
    id = 'fortytwo'
    name = '42'

    def get_default_scope(self):
        return ['public']  # Adjust based on the API's requirements

    def get_auth_params(self, request, action):
        # Custom params can be added here
        return super(FortyTwoProvider, self).get_auth_params(request, action)

    def extract_uid(self, data):
        return str(data['id'])

    def extract_common_fields(self, data):
        return dict(email=data.get('email', ''),
                    username=data.get('username', ''))
