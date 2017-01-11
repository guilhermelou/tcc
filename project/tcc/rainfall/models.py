from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.postgres.fields import JSONField, ArrayField

# Create your models here.

class Section(models.Model):
    name = models.CharField(_('Name'), max_length = 10, unique=True)

class SubSection(models.Model):
    section = models.ForeignKey(Section)
    code = models.PositiveSmallIntegerField(_('Code'))

class Station(models.Model):
    prefix = models.CharField(
            _('Prefix'),
            max_length=200,
            unique=True,
            null=True,
            blank=True
        )
    sub_section = models.ForeignKey(SubSection)
    code = models.PositiveSmallIntegerField(_('Code'))
    name = models.CharField(
            _('Name'),
            max_length=200,
            null=True,
            blank=True
        )
    city = models.CharField(
            _('City'),
            max_length=200,
            null=True,
            blank=True
        )
    basin = models.CharField(
            _('Basin'),
            max_length=200,
            null=True,
            blank=True
        )
    alt = models.DecimalField(
            _('Altitude'),
            max_digits=12,
            decimal_places=6,
            null=True,
            blank=True
        )
    lat = models.DecimalField(
            _('Latitude'),
            max_digits=12,
            decimal_places=6,
            null=True,
            blank=True
        )
    long = models.DecimalField(
            _('Longitude'),
            max_digits=12,
            decimal_places=6,
            null=True,
            blank=True
        )
    year_ini = models.IntegerField(
            _('Initial Year'),
            blank = True,
            null = True
        )
    year_end = models.IntegerField(
            _('End Year'),
            blank = True,
            null = True
        )
    range = models.IntegerField(
            _('Range'),
            blank = True,
            null = True
        )
    day_amount = models.IntegerField(
            _('Day Amount'),
            blank=True,
            null=True
        )
    null_days = models.IntegerField(
            _('Null Days'),
            blank=True,
            null=True
        )
    amount = models.IntegerField(
            _('Total'),
            blank=True,
            null=True
        )
    average = models.FloatField(_('Average'), blank=True, null=True)
    consistency = ArrayField(models.IntegerField(blank=True, null=True))
    years = JSONField()

