from django.db import models

# Create your models here.
class QuadCopterData(models.Model):
    BatteryCell1 = models.IntegerField(default=0)
    BatteryCell2 = models.IntegerField(default=0)
    BatteryCell3 = models.IntegerField(default=0)

    Engine1 = models.IntegerField(default=0)
    Engine2 = models.IntegerField(default=0)
    Engine3 = models.IntegerField(default=0)
    Engine4 = models.IntegerField(default=0)

    Temperature = models.DecimalField(max_digits=4,decimal_places=1)#Celsius
    Altitude = models.DecimalField(max_digits=5,decimal_places=1)#Meter

    Roll = models.DecimalField(max_digits=4,decimal_places=1)
    Pitch = models.DecimalField(max_digits=4,decimal_places=1)
    Yaw = models.DecimalField(max_digits=4,decimal_places=1)
    
    