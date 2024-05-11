from django import forms
from django.utils.translation import gettext_lazy as _

class LoginForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder': _('Your email')}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': _('Password')}))
