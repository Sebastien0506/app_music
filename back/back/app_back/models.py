from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser) :
    username = models.CharField(max_length=50, unique=False)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    favorites = models.ManyToManyField('Music', blank=True, related_name="favorited_by")
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

class Music(models.Model) :
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to="music/")
    filename = models.CharField(max_length=50, unique=True)
    size = models.PositiveBigIntegerField()
    duration = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ManyToManyField('Category', blank=True)
    

class Category(models.Model) :
    name = models.CharField(max_length=50)




