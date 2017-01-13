from django.shortcuts import render
from rainfall.models import Station
# Create your views here.

def index(request):
	return render(request, 'vtmultiscale/index.html')

def custom(request):
	return render(request, 'vtmultiscale/heatmap_custom.html')

def calendar(request):
    station = Station.objects.all().first()
    return render(request, 'vtmultiscale/calendar.html', {"station": station})


def map(request):
    stations = Station.objects.all()[:5]
    print stations
    return render(request, 'vtmultiscale/map.html', {"stations": stations})

