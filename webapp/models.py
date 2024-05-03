from django.db import models
from django.contrib.auth.models import User

# Placeholder function for the default profile picture
def default_profile_pic():
    return "profile_pics/default_pic.jpg"

LANGUAGE_CHOICES = (
    ('en', 'English'),
    ('ar', 'العربية'),  # Arabic 
    ('es', 'Español'),  # Spanish
    ('ru', 'Русский'),  # Russian
    ('hi', 'हिन्दी'),   # Hindi
)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=9, unique=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', default=default_profile_pic)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en')

    def __str__(self):
        return self.nickname

# Define game type choices
GAME_TYPE_CHOICES = (
    (1, 'Classic Pong'),
    (2, 'Classic Pong Tournament'),
    (3, 'Classic Pong AI'),
    (4, 'Modified Pong'),
    (5, 'Modified Pong Tournament'),
    (6, 'Modified Pong AI'),
    (7, 'Tic-Tac-Toe'),
    (8, 'Tic-Tac-Toe Tournament'),
    (9, 'Tic-Tac-Toe AI'),
    (10, 'Modified Tic-Tac-Toe'),
    (11, 'Modified Tic-Tac-Toe Tournament'),
    (12, 'Modified Tic-Tac-Toe AI'),
)

class Game(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    game_type = models.IntegerField()   
    game_result = models.CharField(max_length=4)  # 'win', 'lose', 'draw'
    date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game ID: {self.id}, User: {self.user_profile.nickname}, Type: {self.game_type}, Result: {self.game_result}, Date: {self.date_time}"
