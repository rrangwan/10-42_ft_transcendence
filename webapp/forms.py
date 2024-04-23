from django import forms
from .models import UserProfile
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['nickname', 'profile_pic']
        widgets = {
            'nickname': forms.TextInput(attrs={'class': 'form-control'}),
            'profile_pic': forms.FileInput(attrs={'class': 'form-control'}),
        }

    def clean_nickname(self):
        nickname = self.cleaned_data['nickname']
        # Check if the nickname already exists in the database
        if UserProfile.objects.exclude(id=self.instance.id).filter(nickname=nickname).exists():
            # Revert to the original value if the new nickname is not unique
            original_nickname = self.instance.nickname
            self.cleaned_data['nickname'] = original_nickname
            raise forms.ValidationError("Nickname already exists. Please choose a different one.")
        return nickname

class CustomUserCreationForm(UserCreationForm):
    nickname = forms.CharField(required=True, max_length=9, help_text='Nickname (defaults to username).')

    class Meta:
        model = User
        fields = ('username', 'nickname', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            # Set nickname as username if not provided
            nickname = self.cleaned_data.get('nickname') if self.cleaned_data.get('nickname') else user.username
            UserProfile.objects.create(user=user, nickname=nickname)
        return user