from django.shortcuts import render
from rainfall.models import Station
from django.http import JsonResponse
import json
from django.core import serializers
# Create your views here.

def index(request):
    return render(request, 'vtmultiscale/index.html')

def custom(request):
    return render(request, 'vtmultiscale/heatmap_custom.html')

def calendar(request):
    min_year = 1990
    max_year = 1997
    station = Station.objects.all().first()
    years = station.years
    year_list = []
    for year in years:
        if year['year'] >= min_year and year['year'] <= max_year:
            year_list.append(year)
    print(year_list)
    return render(request, 'vtmultiscale/calendar.html', {"station": station})

def get_year(request):
    min_year = 1990
    max_year = 1997
    station = Station.objects.all().first()
    years = station.years
    year_list = []
    for year in years:
        if year['year'] >= min_year and year['year'] <= max_year:
            year_list.append(year)
    print(year_list)
    response = JsonResponse({'year_list': year_list})
    return response

def map(request):
    json_fields = (
        'prefix',
        'sub_section',
        'code',
        'name',
        'city',
        'basin',
        'alt',
        'lat',
        'long',
        'year_ini',
        'year_end',
        'range',
        'day_amount',
        'null_days',
        'amount',
        'average',
        'consistency'
    )
    stations = Station.objects.defer('years').all()
    stations_json = serializers.serialize(
            'json',
            stations,
            fields = json_fields
    )

    return render(request, 'vtmultiscale/map.html', {
            "stations_json": stations_json
        })

