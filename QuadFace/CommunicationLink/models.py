from django.db import models

# Create your models here.
class QuadCopterData(models.Model):
    x_angle = models.IntegerField(default=0)
    y_angle = models.IntegerField(default=0)
    z_angle = models.IntegerField(default=0)