from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres.fields import JSONField
# Create your models here.
class MultiScale(models.Model):
	rain_month = JSONField()
