from django.urls import path
from . import views

app_name = "Post"

urlpatterns = [
    path('', views.post_list_and_create, name='main-board'),
    path('data/<int:num_posts>/', views.load_post_data, name='load-post-data'),
    path('like-unlike/', views.like_unlike_post, name='like-unlike'),
    path('<id>/', views.post_detail, name="post-detail"),
    path('<id>/data/', views.post_detail_data, name="post-detail-data"),
    path('<id>/update/', views.post_update, name="post-update"),
    path('<id>/delete/', views.post_delete, name="post-delete"),
    
]
