from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('sounds/', views.sounds, name='sounds'),
    path('profile/', views.user_profile, name='profile'),
    path('mixes/', views.mixes, name='mixes'),
    path('login/', views.user_login, name='user_login'),
    path('logout/', views.user_logout, name='user_logout'),
    path('signup/', views.user_signup, name='user_signup')
]