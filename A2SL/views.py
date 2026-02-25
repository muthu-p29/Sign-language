from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.staticfiles import finders
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
import json

def home_view(request):
	return render(request,'home.html')


def about_view(request):
	return render(request,'about.html')


def contact_view(request):
	return render(request,'contact.html')

@login_required(login_url="login")
def animation_view(request):
	if request.method == 'POST':
		text = request.POST.get('sen')
		processed_data = process_text_to_words(text)
		return render(request,'animation.html',{
			'words': processed_data['words'],
			'text': text
		})
	else:
		return render(request,'animation.html')


# New API Views
@require_http_methods(["POST"])
@csrf_exempt
def api_translate(request):
    """API endpoint for text translation"""
    try:
        data = json.loads(request.body)
        text = data.get('text', '')
        
        if not text.strip():
            return JsonResponse({'error': 'Text is required'}, status=400)
        
        processed_data = process_text_to_words(text)
        
        return JsonResponse({
            'success': True,
            'words': processed_data['words'],
            'original_text': text,
            'tense_info': processed_data.get('tense_info', {})
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["POST"])
@csrf_exempt
def api_auth_login(request):
    """API endpoint for user login"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["POST"])
@csrf_exempt
def api_auth_signup(request):
    """API endpoint for user registration"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password1 = data.get('password1')
        password2 = data.get('password2')
        
        if not all([username, password1, password2]):
            return JsonResponse({'error': 'All fields are required'}, status=400)
        
        if password1 != password2:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)
        
        # Use Django's UserCreationForm for validation
        form_data = {
            'username': username,
            'password1': password1,
            'password2': password2
        }
        form = UserCreationForm(form_data)
        
        if form.is_valid():
            user = form.save()
            login(request, user)
            return JsonResponse({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })
        else:
            # Return form errors
            errors = {}
            for field, error_list in form.errors.items():
                errors[field] = error_list[0]  # Get first error for each field
            return JsonResponse({'error': errors}, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["POST"])
def api_auth_logout(request):
    """API endpoint for user logout"""
    logout(request)
    return JsonResponse({'success': True})


@require_http_methods(["GET"])
def api_auth_user(request):
    """API endpoint to get current user info"""
    if request.user.is_authenticated:
        return JsonResponse({
            'success': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email
            }
        })
    else:
        return JsonResponse({'error': 'Not authenticated'}, status=401)


def process_text_to_words(text):
    """
    Process text using NLTK and return words for sign language animation
    This is the core NLP processing logic extracted from the original animation_view
    """
    # Convert to lowercase
    text = text.lower()
    
    # Tokenize the sentence
    words = word_tokenize(text)
    
    # POS tagging for tense detection
    tagged = nltk.pos_tag(words)
    tense = {}
    tense["future"] = len([word for word in tagged if word[1] == "MD"])
    tense["present"] = len([word for word in tagged if word[1] in ["VBP", "VBZ", "VBG"]])
    tense["past"] = len([word for word in tagged if word[1] in ["VBD", "VBN"]])
    tense["present_continuous"] = len([word for word in tagged if word[1] in ["VBG"]])
    
    # Stop words that will be removed
    stop_words = set([
        "mightn't", 're', 'wasn', 'wouldn', 'be', 'has', 'that', 'does', 'shouldn', 'do', "you've",
        'off', 'for', "didn't", 'm', 'ain', 'haven', "weren't", 'are', "she's", "wasn't", 'its',
        "haven't", "wouldn't", 'don', 'weren', 's', "you'd", "don't", 'doesn', "hadn't", 'is',
        'was', "that'll", "should've", 'a', 'then', 'the', 'mustn', 'i', 'nor', 'as', "it's",
        "needn't", 'd', 'am', 'have', 'hasn', 'o', "aren't", "you'll", "couldn't", "you're",
        "mustn't", 'didn', "doesn't", 'll', 'an', 'hadn', 'whom', 'y', "hasn't", 'itself',
        'couldn', 'needn', "shan't", 'isn', 'been', 'such', 'shan', "shouldn't", 'aren',
        'being', 'were', 'did', 'ma', 't', 'having', 'mightn', 've', "isn't", "won't"
    ])
    
    # Remove stopwords and apply lemmatizing
    lr = WordNetLemmatizer()
    filtered_text = []
    for w, p in zip(words, tagged):
        if w not in stop_words:
            if p[1] in ['VBG', 'VBD', 'VBZ', 'VBN', 'NN']:
                filtered_text.append(lr.lemmatize(w, pos='v'))
            elif p[1] in ['JJ', 'JJR', 'JJS', 'RBR', 'RBS']:
                filtered_text.append(lr.lemmatize(w, pos='a'))
            else:
                filtered_text.append(lr.lemmatize(w))
    
    # Replace 'I' with 'Me' for sign language
    words = filtered_text
    temp = []
    for w in words:
        if w == 'I':
            temp.append('Me')
        else:
            temp.append(w)
    words = temp
    
    # Add tense markers
    probable_tense = max(tense, key=tense.get)
    
    if probable_tense == "past" and tense["past"] >= 1:
        words = ["Before"] + words
    elif probable_tense == "future" and tense["future"] >= 1:
        if "Will" not in words:
            words = ["Will"] + words
    elif probable_tense == "present":
        if tense["present_continuous"] >= 1:
            words = ["Now"] + words
    
    # Split words if video is not available
    filtered_text = []
    for w in words:
        path = w + ".mp4"
        f = finders.find(path)
        if not f:
            # Split the word into individual characters
            for c in w:
                filtered_text.append(c)
        else:
            filtered_text.append(w)
    
    return {
        'words': filtered_text,
        'tense_info': tense,
        'probable_tense': probable_tense
    }




def signup_view(request):
	if request.method == 'POST':
		form = UserCreationForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request,user)
			# log the user in
			return redirect('animation')
	else:
		form = UserCreationForm()
	return render(request,'signup.html',{'form':form})



def login_view(request):
	if request.method == 'POST':
		form = AuthenticationForm(data=request.POST)
		if form.is_valid():
			#log in user
			user = form.get_user()
			login(request,user)
			if 'next' in request.POST:
				return redirect(request.POST.get('next'))
			else:
				return redirect('animation')
	else:
		form = AuthenticationForm()
	return render(request,'login.html',{'form':form})


def logout_view(request):
	logout(request)
	return redirect("home")
