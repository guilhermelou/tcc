from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.postgres.fields import JSONField, ArrayField
from math import fabs

# Create your models here.

def convert_coordinate(str):
    ''' Function to convert a coordinate to use on D3, this function returns
        the new str
    '''
    if str[0] != '-':
        str = str.replace(" ", "")
        integer = str[0:2]
        decimal = str[2:]
        real = '-'+integer+'.'+decimal
    return real

def convert_non_str_coordinate(coord):
    ''' Function to convert a coordinate that is not in string, this function
        returns the new str
    '''
    return convert_coordinate(str(int(fabs(coord))))

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

    @staticmethod
    def convert_system_all_stations():
        '''Function used to update all coordinates
        '''
        for station in Station.objects.all():
            station.lat = convert_non_str_coordinate(station.lat)
            station.long = convert_non_str_coordinate(station.long)
            station.save()



