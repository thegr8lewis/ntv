from django.db import models
from django.core.validators import EmailValidator
from django.db import models


import uuid

class NewsItem(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.CharField(max_length=100)
    published_date = models.DateTimeField()
    category = models.CharField(max_length=50)
    source = models.CharField(max_length=100)
    url = models.URLField()
    
    def __str__(self):
        return self.title

class UserSession(models.Model):
    session_id = models.CharField(max_length=50, unique=True)
    device_type = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)

class NewsInteraction(models.Model):
    news_item = models.ForeignKey(NewsItem, on_delete=models.CASCADE)
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE)
    liked = models.BooleanField(default=False)
    viewed = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    last_viewed = models.DateTimeField(auto_now=True)

class UserBehavior(models.Model):
    EVENT_TYPES = [
        ('page_view', 'Page View'),
        ('news_view', 'News View'),
        ('news_like', 'News Like'),
        ('news_unlike', 'News Unlike'),
        ('session_time', 'Session Time'),
        ('scroll_depth', 'Scroll Depth'),
    ]
    
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    event_data = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.session.session_id} - {self.event_type}"

class Resource(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    latitude = models.FloatField()
    longitude = models.FloatField()
    category = models.CharField(max_length=50)  # e.g., 'Farming', 'Health'

    def __str__(self):
        return self.name

class NewsTopic(models.Model):
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=10)
    
    def __str__(self):
        return self.name

class Subscriber(models.Model):
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    topics = models.ManyToManyField(NewsTopic)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.email