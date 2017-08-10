from django.shortcuts import render
from rainfall.models import Station, Section, SubSection
from django.http import JsonResponse
import json
from django.core import serializers
from datetime import datetime
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
        'consistency',
        'null_days_array_str'
    ]
    stations = Station.objects.values(*station_fields).all().order_by('prefix')
    # sections = Section.objects.all()
    # sub_sections = SubSection.objects.all()
    stations_json = json.dumps(list(stations))
    #sections_json = json.dumps(list(sections.values()))
    #sub_sections_json = json.dumps(list(sub_sections.values()))

    return render(request, 'vtmultiscale/index.html', {
            "stations_json": stations_json
            #"sections_json": sections_json,
            #"sub_sections_json": sub_sections_json
        })
    return render(request, 'vtmultiscale/index.html')

def stations_ordered(request):

    ordered_station_fields = [
        'id',
        'year_ini',
        'year_end',
        'prefix',
        'alt',
        'lat',
        'long',
        'consistency',
        'null_days_array_str'
    ]
    order_field = request.POST["order_field"]
    order_way = request.POST["order_way"]
    if order_way.upper() == 'TRUE':
        order_field = "-{}".format(order_field)
    stations = Station.objects.values(*ordered_station_fields).all().order_by(
            order_field)
    response = JsonResponse({'stations': list(stations)})
    return response

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
        station_id = int(request.POST["station_id"])
        station = None
        try:
            station = Station.objects.filter(id=station_id).values()[0]
        except:
            pass
        years = station["years"]
        year_list = []
        for year in years:
            if year['year'] >= min_year and year['year'] <= max_year:
                year_list.append(year)
        station.pop("years", 0)
        station.pop("null_days_array_str", 0)
        station.pop("null_days_array", 0)
        station.pop("uni_scale", 0)
        station.pop("sub_section_id", 0)
        response = JsonResponse(
                {'year_list': year_list, "station": station})
        return response

def search_station(request):
    station_fields = [
        'prefix',
        'code',
        'name',
        'city',
        'basin',
        'alt',
        'lat',
        'long',
        'range',
        'day_amount',
        'null_days',
        'amount',
        'average',
        'consistency',
        'null_days_array_str'
    ]
    if request.method == "POST":
        # 1990
        # 1997
        try:
            year_ini = int(request.POST["year_ini"])
        except:
            year_ini = None
        try:
            year_end = int(request.POST["year_end"])
        except:
            year_end = None
        try:
            average_date = datetime.strptime(
                    request.POST["average_date"], "%Y-%m-%d")
        except:
            average_date = None
        try:
            average = float(request.POST["average"])
        except:
            average = None
        time_scale = request.POST["time_scale"]
        signal = request.POST["signal"]
        stations = Station.objects.mix_filter(
			year_ini=year_ini,
			year_end=year_end,
			average_date=average_date,
			time_scale=time_scale,
			signal=signal,
			average=average,
			fields=station_fields
		)
        response = JsonResponse({'stations': stations})
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
        'consistency',
        'null_days_array_str'
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

def focus_context(request):
    return render(request, 'vtmultiscale/focus_context.html')

