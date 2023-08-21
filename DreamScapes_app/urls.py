from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('sounds/', views.sounds, name='sounds'),
    path('profile/', views.user_profile, name='profile'),
    path('mixes/', views.mixes, name='mixes'),
    path('login/', views.user_login, name='user_login'),
    path('logout/', views.user_logout, name='user_logout'),
    path('signup/', views.user_signup, name='user_signup'),
    path('save_user_mix/', views.save_user_mix, name='save_user_mix'),
    path('delete_mix/<int:mix_id>/', views.delete_mix, name='delete_mix'),
    path('edit_mix/<int:mix_id>/', views.edit_mix, name='edit_mix')
]