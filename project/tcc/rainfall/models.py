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

def getGreaterOrMinor(
        station_dict,
        key,
        current_val=None,
        greater=True
    ):
    station_val = station_dict[key]
    if current_val == None:
        return station_val
    else:
        if (greater):
            if (station_val > current_val):
                return station_val
            else:
                return current_val
        else:
            if (station_val < current_val):
                return station_val
            else:
                return current_val

def getBBoxFromStationArray(stations):
    greater_long = None
    greater_lat = None
    minor_long = None
    minor_lat = None
    for station in stations:
        greater_long = getGreaterOrMinor(station, "long", greater_long, True)
        greater_lat= getGreaterOrMinor(station, "lat", greater_lat, True)
        minor_long= getGreaterOrMinor(station, "long", minor_long, False)
        minor_lat= getGreaterOrMinor(station, "lat", minor_lat, False)
    return [minor_long, greater_lat, greater_long, minor_lat]


class Section(models.Model):
    name = models.CharField(_('Name'), max_length = 10, unique=True)
    bbox = ArrayField(
            models.FloatField(),
            size=4,
            default=[]
    )
    def updateBBox(self):
        '''Function used to update bbox values
        '''
        stations = Station.objects.filter(
                sub_section__section=self
        ).values("lat", "long")
        self.bbox = getBBoxFromStationArray(stations)
        self.save()


class SubSection(models.Model):
    section = models.ForeignKey(Section)
    code = models.PositiveSmallIntegerField(_('Code'))
    bbox = ArrayField(
            models.FloatField(),
            size=4,
            default=[]
    )
    def updateBBox(self):
        '''Function used to update bbox values
        '''
        stations = Station.objects.filter(
                sub_section=self
        ).values("lat", "long")
        self.bbox = getBBoxFromStationArray(stations)
        self.save()

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
    alt = models.FloatField(
            _('Altitude'),
            null=True,
            blank=True
        )
    lat = models.FloatField(
            _('Latitude'),
            null=True,
            blank=True
        )
    long = models.FloatField(
            _('Longitude'),
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



