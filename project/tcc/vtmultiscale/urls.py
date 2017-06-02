from django.conf.urls import url

urlpatterns = [
    url(r'^get_year/', 'vtmultiscale.views.get_year', name='get_year'),
    url(
        r'^search_station/',
        'vtmultiscale.views.search_station',
        name='search_station'
    ),
]
