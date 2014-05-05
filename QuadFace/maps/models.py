from django.db import models
from decimal import Decimal

# Create your models here.
class coordinates(models.Model):
    latitude = models.DecimalField(max_digits=9,decimal_places=6)
    longitude = models.DecimalField(max_digits=9,decimal_places=6)