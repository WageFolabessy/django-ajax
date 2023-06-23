from django.shortcuts import render
from django.http import JsonResponse
from .forms import PostForm
from .models import Post
from Profile.models import Profile
# Create your views here.

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

def post_list_and_create(request):
    form = PostForm(request.POST or None)
    if(is_ajax(request=request)):
        if(form.is_valid()):
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save() 
            
            return JsonResponse({
                'title': instance.title,
                'description': instance.description,
                'author': instance.author.user.username,
                'id': instance.id,
            })
            
    context = {
        'form': form,
    }
    return render(request, 'Post/main.html', context)

def load_post_data(request, num_posts):
    if(is_ajax(request=request)):
        visible = 3
        upper = num_posts
        lower = upper - visible
        size = Post.objects.all().count()
        
        qs = Post.objects.all()
        data = []
        for obj in qs:
            item = {
                'id': obj.id,
                'title': obj.title,
                'description': obj.description,
                'liked': True if request.user in obj.liked.all() else False,
                'count_likes': obj.count_likes,
                'author': obj.author.user.username,
            }
            data.append(item)
            
        context = {
            'data': data[lower:upper],
            'size': size,
        }
        return JsonResponse(context)

def like_unlike_post(request):
    if(is_ajax(request=request)):
        pk = request.POST.get("pk")
        obj = Post.objects.get(pk=pk)
        if(request.user in obj.liked.all()):
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
            
        context = {
            'liked': liked,
            'count': obj.count_likes,
        }
        
        return JsonResponse(context)
    
def post_detail(request, id):
    obj = Post.objects.get(id=id)
    form = PostForm()
    
    context = {
        'obj': obj,
        'form': form,
    }
    return render(request, 'Post/detail.html', context)

def post_detail_data(request, id):
    obj = Post.objects.get(id=id)
    data = {
        'id': obj.id,
        'title': obj.title,
        'description': obj.description,
        'author': obj.author.user.username,
        'logged_in': request.user.username,
    }
    context = {
        'data': data,
    }
    
    return JsonResponse(context)

def post_update(request, id):
    obj = Post.objects.get(id=id)
    if(is_ajax(request=request)):
        new_title = request.POST.get("title")
        new_description = request.POST.get("description")
        obj.title = new_title
        obj.description = new_description
        obj.save()
    
    context = {
        'title': new_title,
        'description': new_description,
    }
    
    return JsonResponse(context)
    

def post_delete(request, id):
    obj = Post.objects.get(id=id)
    if(is_ajax(request=request)):
        obj.delete()
    return JsonResponse({})
