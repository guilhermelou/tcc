from django.shortcuts import render

# Create your views here.

def index(request):
	return render(request, 'vtmultiscale/index.html')

def custom(request):
	return render(request, 'vtmultiscale/heatmap_custom.html')
