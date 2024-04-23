from django.db import models
from django.contrib.auth.models import User

# Placeholder function for the default profile picture
def default_profile_pic():
    return "profile_pics/default_pic.jpg"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=9, unique=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', default=default_profile_pic)


    def __str__(self):
        return self.nickname

class Game(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    game_type = models.IntegerField()  #  game types are represented by integers, 1 is classic pong
    game_result = models.CharField(max_length=4)  # 'win', 'lose', 'draw'
    date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game ID: {self.id}, User: {self.user_profile.nickname}, Type: {self.game_type}, Result: {self.game_result}, Date: {self.date_time}"
