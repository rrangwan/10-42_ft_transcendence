from django import forms
from .models import UserProfile
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

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
    username = forms.CharField(
        label="Username", 
        help_text="Enter a username between 2-9 characters. Only letters and numbers allowed.",
        max_length=9,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    nickname = forms.CharField(
        label="Nickname", 
        required=True, 
        max_length=9, 
        help_text='Enter a nickname, it will default to your username if left blank.',
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    password1 = forms.CharField(
        label="Password",
        help_text="Your password must be at least 8 characters long.",
        widget=forms.PasswordInput(attrs={'class': 'form-control'})
    )
    password2 = forms.CharField(
        label="Confirm Password",
        help_text="Enter the same password as before, for verification.",
        widget=forms.PasswordInput(attrs={'class': 'form-control'})
    )    
    

    class Meta:
        model = User
        fields = ('username', 'nickname', 'password1', 'password2')
    
    def clean_username(self):
        username = self.cleaned_data['username']
        if not username.isalnum():
            raise forms.ValidationError("Username should only contain letters and numbers.")
        if len(username) < 2 or len(username) > 9:
            raise forms.ValidationError("Username must be between 2 and 9 characters long.")
        return username

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            # Set nickname as username if not provided
            nickname = self.cleaned_data.get('nickname') if self.cleaned_data.get('nickname') else user.username
            UserProfile.objects.create(user=user, nickname=nickname)
        return user