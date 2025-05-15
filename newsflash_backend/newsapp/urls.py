from django.urls import path
from .views import NewsTopicListView, SubscribeView, SubscriberTopicsView, UpdateEmailView, chat_view
from . import views

urlpatterns = [
    path('topics/', NewsTopicListView.as_view(), name='topic-list'),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('subscriber-topics/<str:email>/', SubscriberTopicsView.as_view(), name='subscriber-topics'),
    path('update-email/<str:email>/', UpdateEmailView.as_view(), name='update-email'),
    path('chat/', chat_view),
    path('track/', views.track_user_behavior, name='track_user_behavior'),
    path('likes/', views.handle_like, name='handle_like'),
    path('likes/get/', views.get_liked_news, name='get_liked_news'),
    path('news-stats/', views.get_news_stats, name='get_news_stats'),
    
]