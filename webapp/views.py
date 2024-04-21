from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def pong_game(request):
    return render(request, 'pong_game.html')