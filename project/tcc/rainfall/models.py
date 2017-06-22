from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.postgres.fields import JSONField, ArrayField
from django.core import serializers
from datetime import date, timedelta
from math import fabs
import json
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

def getGreaterOrMinor(station_dict, key, current_val=None, greater=True):
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
    average = models.FloatField(_('Average'), blank=True, null=True)
    def updateBBox(self):
        '''Function used to update bbox values
        '''
        stations = Station.objects.filter(
                sub_section__section=self
            ).values("lat", "long")
        self.bbox = getBBoxFromStationArray(stations)
        self.save()
    def updateAverage(self):
        '''Function used to update average values
        '''
        stations = Station.objects.filter(
                sub_section__section=self
            ).values("average")
        average = 0
        for station in stations:
            average += station['average']
        self.average = average/len(stations)
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

class StationManager(models.Manager):
    def mix_filter(
                self,
                year_ini=None,
                year_end=None,
                average_date=None,
                time_scale=None,
                signal=None,
                average=None,
                fields=None
            ):
        SQL = ''
        comma_fields = " , ".join(fields)
        if (average_date and average):
            SQL+="""WITH years_data AS (
                SELECT id, year_ini, year_end, st_years, {}
                    FROM rainfall_station st,
                    jsonb_array_elements(st.years) st_years
                    WHERE (st_years->>'year')::int = {}
                )
                SELECT DISTINCT ON (id) id, year_ini, year_end, {}
                FROM years_data WHERE""".format(
                         comma_fields, average_date.year, comma_fields)
            if(time_scale=="Anual"):
                SQL+="""(st_years->>'average')::float {} {}
                """.format(signal, average)
            elif(time_scale=="Mensal"):
                SQL+="""(st_years->'months'->{}->>'average')::float {} {}
                """.format(
                        (average_date.month-1),
                        signal,
                        average)
            elif(time_scale=="Diaria"):
                SQL+="""
                (st_years->'months'->{}->'days'->{}->>'day_average')::float {} {}
                """.format(
                        (average_date.month-1),
                        (average_date.day-1),
                        signal,
                        average)
        else:
            SQL +="""
            SELECT DISTINCT ON (id) id, year_ini, year_end, {}
            FROM rainfall_station WHERE 1 = 1
            """.format(comma_fields)
        if year_ini:
            SQL+=" AND year_ini <= {}".format(year_ini)
        if year_end:
            SQL+=" AND year_end >= {}".format(year_end)
        print SQL
        #if time_scale == ''
        raw_query = self.raw(SQL)#, ['0'])
        # This is one way
        '''
        data = serializers.serialize("json", raw_query, fields=fields)
        print data
        station_dict_list = []
        for obj in json.loads(data):
            station_dict_list.append(obj['fields'])'''
        # Other way
        station_dict_list = [dict(obj.__dict__) for obj in raw_query]
        for obj in station_dict_list:
            obj.pop('_state', None)
        return station_dict_list

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
    null_days_array = ArrayField(models.DateField(blank=True, null=True))
    null_days_array_str = ArrayField(
            models.CharField(max_length=200,blank=True, null=True)
        )
    amount = models.IntegerField(
            _('Total'),
            blank=True,
            null=True
        )
    average = models.FloatField(_('Average'), blank=True, null=True)
    consistency = ArrayField(models.IntegerField(blank=True, null=True))
    years = JSONField()
    uni_scale = JSONField()

    objects = StationManager()

    @staticmethod
    def convert_system_all_stations():
        '''Function used to update all coordinates
        '''
        for station in Station.objects.all():
            station.lat = convert_non_str_coordinate(station.lat)
            station.long = convert_non_str_coordinate(station.long)
            station.save()

    def update_null_days_array(self):
        '''Function used to update all coordinates
        '''
        # for station in Station.objects.all():
        station = self
        # Getting the json data
        years = station.years
        # Starting a new array for null days date on this Station
        station_null_days_array = []
        # Starting a new array for null days date on this Station with string
        # data
        station_null_days_array_str = []
        # Going through the years searching for null days
        for year in years:
            # Saving the year number to create the date after
            year_nmb = year['year']
            # Getting the months of this year
            months = year['months']
            # Starting a new array for null days date on this year
            year_null_days_array = []
            # Going through months
            for month in months:
                month_nmb = month['month']
                days = month['days']
                month_null_days_array = []
                for day in days:
                    day_average = day['day_average']
                    day_nmb = day['day']
                    if day_average < 0:
                        null_date = date(
                                year_nmb, month_nmb, day_nmb)
                        month_null_days_array.append(null_date.isoformat())
                        year_null_days_array.append(null_date.isoformat())
                        station_null_days_array_str.append(
                                null_date.isoformat()
                            )
                        station_null_days_array.append(null_date)
                month['null_days_array'] = month_null_days_array
            year['null_days_array'] = year_null_days_array
        station.null_days_array = station_null_days_array
        station.null_days_array_str = station_null_days_array_str
        station.save()

    def update_uni_scale(self):
        '''Function used to update all coordinates
        '''
        EMPTY = "Empty"
        CONS = "Consisted"
        NOT_CONS = "Not Consisted"
        station = self
        data_item = {}
        years_array = []
        years_state = EMPTY
        data_item["categories"] = {
                EMPTY: {"color": "#000"},
                CONS: {"color": "#449d44"},
                NOT_CONS: {"color": "#d9534d"}
            }
        data_item["measure"] = station.prefix
        data_item["interval_s"] = 3*30.5*24*60*60
        data_item["data"] = years_array
        consistency_array = station.consistency
        consistency_index = 0
        null_days_array = station.null_days_array
        null_days_index = 0
        null_day_happen = False
        first_date_of_year = None
        last_date_of_year = None
        null_day = None
        last_null_day = None
        for year in range(station.year_ini, station.year_end+1):
            first_date_of_year = date(year, 1, 1)
            last_date_of_year = date(year, 12, 31)
            try:
                current_consisted_year = int(
                        consistency_array[consistency_index])
            except:
                current_consisted_year = 0
            if (year==current_consisted_year):
                consistency_index += 1
                if (
                        years_state==EMPTY or
                        years_state==NOT_CONS
                        ):
                    years_state = CONS
                    years_array.append([first_date_of_year.isoformat(), CONS])
            else:
                if (
                        years_state==EMPTY or
                        years_state==CONS
                        ):
                    years_state = NOT_CONS
                    years_array.append(
                            [first_date_of_year.isoformat(), NOT_CONS])
            if (null_days_index < len(null_days_array)):
                try:
                    null_day = null_days_array[null_days_index]
                except:
                    null_day = date(0001,01,01)
                while(
                        null_day >= first_date_of_year and
                        null_day <= last_date_of_year and
                        null_days_index < len(null_days_array)
                        ):
                    last_null_day = null_days_array[null_days_index]
                    years_array.append([null_day.isoformat(), EMPTY])
                    null_day_happen = True
                    null_days_index += 1
                    if (null_days_index < len(null_days_array)):
                        null_day = null_days_array[null_days_index]
                        after_null_day = last_null_day
                        after_null_day += timedelta(days=1)
                        if (after_null_day < null_day):
                            if (years_state==CONS):
                                years_array.append(
                                        [after_null_day.isoformat(), CONS])
                            else:
                                years_array.append(
                                        [after_null_day.isoformat(), NOT_CONS])
        if (years_state==CONS):
            years_array.append([last_date_of_year.isoformat(), CONS])
        else:
            years_array.append([last_date_of_year.isoformat(), NOT_CONS])
        station.uni_scale = data_item
        station.save()

