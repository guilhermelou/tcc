from django.shortcuts import render
from rainfall.models import Station, Section, SubSection
from django.http import JsonResponse
import json
from django.core import serializers
# Create your views here.

def index(request):
    station_fields = [
        'id',
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
    ]

    stations = Station.objects.values(*station_fields).all()
    sections = Section.objects.all()
    sub_sections = SubSection.objects.all()
    stations_json = json.dumps(list(stations))
    sections_json = json.dumps(list(sections.values()))
    sub_sections_json = json.dumps(list(sub_sections.values()))

    return render(request, 'vtmultiscale/index.html', {
            "stations_json": stations_json,
            "sections_json": sections_json,
            "sub_sections_json": sub_sections_json
        })
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
    return render(request, 'vtmultiscale/calendar.html', {"station": station})

def get_year(request):
    if request.method == "POST":
        # 1990
        # 1997
        min_year = int(request.POST["year_ini"])
        max_year = int(request.POST["year_end"])
        print min_year
        print max_year
        station_id = int(request.POST["station_id"])
        station = None
        try:
            station = Station.objects.get(id=station_id)
        except:
            pass
        years = station.years
        year_list = []
        for year in years:
            print year['year']
            if year['year'] >= min_year and year['year'] <= max_year:
                year_list.append(year)
        print(year_list)
        response = JsonResponse({'year_list': year_list})
        return response

def map(request):
    station_fields = [
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
    ]

    stations = Station.objects.values(*station_fields).all()
    sections = Section.objects.all()
    sub_sections = SubSection.objects.all()
    stations_json = json.dumps(list(stations))
    sections_json = json.dumps(list(sections.values()))
    sub_sections_json = json.dumps(list(sub_sections.values()))

    return render(request, 'vtmultiscale/map.html', {
            "stations_json": stations_json,
            "sections_json": sections_json,
            "sub_sections_json": sub_sections_json
        })

