from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=9, unique=True)
    pong_games_played = models.IntegerField(default=0)
    pong_wins = models.IntegerField(default=0)
    pong_draws = models.IntegerField(default=0)
    pong_losses = models.IntegerField(default=0)
    tic_tac_toe_games_played = models.IntegerField(default=0)
    tic_tac_toe_wins = models.IntegerField(default=0)
    tic_tac_toe_draws = models.IntegerField(default=0)
    tic_tac_toe_losses = models.IntegerField(default=0)

    def __str__(self):
        return self.nickname
