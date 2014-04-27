from django.db import models

# Create your models here.
class QuadCopterData(models.Model):
    x_angle = models.IntegerField(default=0)
    y_angle = models.IntegerField(default=0)
    z_angle = models.IntegerField(default=0)
    
    def as_json(self):
            return dict(
                input_id=self.id, x_angle=self.x_angle,
                y_angle=self.y_angle, z_angle=self.z_angle)