from django.db import models
from django.core.validators import EmailValidator
from django.db import models

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