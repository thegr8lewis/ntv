from django.urls import path
from .views import NewsTopicListView, SubscribeView, SubscriberTopicsView, UpdateEmailView, chat_view

urlpatterns = [
    path('topics/', NewsTopicListView.as_view(), name='topic-list'),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('subscriber-topics/<str:email>/', SubscriberTopicsView.as_view(), name='subscriber-topics'),
    path('update-email/<str:email>/', UpdateEmailView.as_view(), name='update-email'),
    path('chat/', chat_view),
]