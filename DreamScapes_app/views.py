from django.shortcuts import render, redirect
from .models import Sound, UserMix, Category, DreamUser
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout 
from django.shortcuts import get_object_or_404


# ------------------------------- VIEWS ------------------------------
def index(request):
    return render(request, 'index.html')

def sounds(request):
    all_sounds = Sound.objects.all()
    new_sounds = Sound.objects.all().order_by('-created_at')[:18]  # show last added 20 sounds
    categories = Category.objects.all()
    return render(request, 'sounds.html', {'all_sounds': all_sounds, 'new_sounds': new_sounds, 'categories': categories})

def user_profile(request):
    if not request.user.is_authenticated:
        # Redirect to login page or show an error
        return redirect('signup')

    user_mixes = UserMix.objects.filter(user=request.user)
    return render(request, 'profile.html', {'user_mixes': user_mixes})


def mixes(request):
    # Fetch all mix objects
    all_mixes = UserMix.objects.all()
    return render(request, 'mixes.html', {'mixes': all_mixes})



# --------------------- REGISTRATION, LOGIN, LOGOUT ---------------------

# LOGIN
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
            messages.success(request, f"Nice to see you here, {user.username}!")
            return redirect('index')
        else:
            print(f"**************** !!! Login Failed !!! ***************")
            # If authentication fails, show an error message or redirect back to the login page
            messages.error(request, "Incorrect username or password. Please try again.")
            return render(request, 'signup.html')
    return render(request, 'index.html')

# LOGOUT
def user_logout(request):
    print("******************* User logged out *******************")
    logout(request)
    return redirect('index')

# SIGN UP (REGISTRATION)
def user_signup(request):
    print("******************** User Registration *******************")
    try:
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            profile_picture = request.FILES.get('profile_picture')
            date_of_birth = request.POST.get('date_of_birth')
            print(f"username : {username} \n passowrd : {password}")    
            user = DreamUser.objects.create_user(username=username, password=password, date_of_birth=date_of_birth, profile_picture=profile_picture)
            user.save()
            messages.success(request, f"Congratulations! {user.username} is now registered. Please login to continue.")
    except Exception as e:
        print(f"******************* Error occured ******************\n{e}\n")
        if 'UNIQUE constraint' in str(e):
            messages.error(request, f"A user account with the username {username} already exists. Please try again.")
        else:
            messages.error(request, f"Something went wrong. Please try again.")
    return render(request, 'signup.html')


# --------------------- MIXES ---------------------
from django.db import transaction

def save_user_mix(request):
    if request.method != "POST":
        print("******************* Invalid method *******************")
        messages.error(request,"Invalid method. Please try again.")
        

    if not request.user.is_authenticated:
        print("******************* User not logged in *******************")
        messages.error(request,"Please login to save your mix.")

    title = request.POST.get('mixTitle')
    sound_ids = request.POST.getlist('sound_ids[]')
    mix_id = request.POST.get('mixId')

    try:
        with transaction.atomic():  # Start a transaction
            if mix_id:  # Update operation
                mix = UserMix.objects.get(pk=mix_id)
                mix.title = title
            else:  # New mix
                mix = UserMix(user=request.user, title=title)
            
            mix.save()

            # ManyToMany relationship between mix and sounds
            mix.sounds.clear()
            sounds = Sound.objects.filter(id__in=sound_ids)
            mix.sounds.add(*sounds)
            messages.success(request, "Mix successfully saved. You can find it in your profile.")
            print(f"******************* Mix successfully saved *******************\n{mix}")
        return redirect('sounds')
    
    except Exception as e:
        # For now, print the exception but consider logging in production
        messages.error(request,"Something went wrong. Please try again.")
        print(f"******************* Error occured ******************\n{e}\n")
        return render(request, 'sounds.html', {'error': True,})
    

# ------------------------- DELETE MIX

def delete_mix(request, mix_id):
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        messages.error(request, "Please login to delete a mix.")
        return redirect('signup')

    # Fetch the mix object
    mix = get_object_or_404(UserMix, pk=mix_id)

    # Ensure the user is the owner of the mix
    if mix.user != request.user:
        messages.error(request, "You don't have permission to delete this mix.")
        return redirect('profile')

    # Delete the mix
    mix.delete()
    messages.success(request, "Mix successfully deleted.")
    return redirect('profile')

# -------------------- edit MIX

def edit_mix(request, mix_id):
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        messages.error(request, "Please login to edit a mix.")
        return redirect('signup')

    # Fetch the mix object
    mix = get_object_or_404(UserMix, pk=mix_id)

    # Ensure the user is the owner of the mix
    if mix.user != request.user:
        messages.error(request, "You don't have permission to edit this mix.")
        return redirect('profile')

    # Handle POST request (form submission)
    if request.method == 'POST':
        sound_ids_to_keep = request.POST.getlist('sound_ids[]')

        # Update the many-to-many relationship to only keep selected sounds
        sounds_to_keep = Sound.objects.filter(id__in=sound_ids_to_keep)
        mix.sounds.clear()
        mix.sounds.add(*sounds_to_keep)

        messages.success(request, "Mix successfully edited.")
        return redirect('profile')

    # Handle GET request (display the form)
    selected_sounds = mix.sounds.all()
    context = {
        'mix': mix,
        'selected_sounds': selected_sounds,
    }
    return render(request, 'edit_mix.html', context)
