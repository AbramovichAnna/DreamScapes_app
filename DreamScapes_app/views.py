from django.shortcuts import render, redirect
from .models import Sound, UserMix, Category, DreamUser
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect


# ------------------------------- VIEWS ------------------------------
def index(request):
    return render(request, 'index.html')

def sounds(request):
    all_sounds = Sound.objects.all()
    latest_sounds = Sound.objects.all().order_by('-created_at')[:20]  # show last added 20 sounds
    categories = Category.objects.all()
    return render(request, 'sounds.html', {'all_sounds': all_sounds, 'latest_sounds': latest_sounds, 'categories': categories})

def user_profile(request):
    mixes = UserMix.objects.filter(user=request.user)
    return render(request, 'profile.html', {'mixes': mixes})

def other_users_mixes(request):
    mixes = UserMix.objects.exclude(user=request.user)
    return render(request, 'users_mixes.html', {'mixes': mixes})


# --------------------- REGISTRATION, LOGIN, LOGOUT ---------------------
def user_signup(request):
    print("******************** User Registration *******************")
    try:
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            profile_picture = request.FILES.get('profile_picture')
            date_of_birth = request.POST.get('date_of_birth')
            print("date_of_birth = ", date_of_birth)
            print(f"username : {username} \n passowrd : {password}")    
            user = DreamUser.objects.create_user(username=username, password=password, date_of_birth=date_of_birth, profile_picture=profile_picture)
            user.save()
            messages.success(request, f"Hurray! {user.username} is now registered. Please login to continue.")
    except Exception as e:
        print(f"******************* Error occured ******************\n{e}\n")
        messages.error(request, f"A user account with the username {username} already exists. Please try again with a different username.")
    return render(request, 'index.html')

def user_login(request):
    print("********************* User Login ********************")
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(f"username={username}\npassowrd={password}")
        # Authenticate the user - validating user password. return user object if valid
        user = authenticate(request, username=username, password=password)
        print(f"******************** Check Login  *******************")
        if user is not None:
            # If the credentials are correct, log in the user
            login(request, user)
            print(f"User {user} successfully logged in\n************* Redirecting to index page *************")
            messages.success(request, f"Wlecome back {user.username}!")
            return redirect('index')
        else:
            print(f"**************** !!! Login Failed !!! ***************")
            # If authentication fails, show an error message or redirect back to the login page
            messages.error(request, "Login Failed. Incorrect username or password. Please try again.")
            # return redirect('index')
    return render(request, 'index.html')

def user_logout(request):
    print("******************* User logged out *******************")
    logout(request)
    return redirect('index')