from django.db import models

# Create your models here.

class logData(models.Model):
    logmessage = models.CharField(max_length=255)
    kindOfMessage = models.CharField(max_length=50)

