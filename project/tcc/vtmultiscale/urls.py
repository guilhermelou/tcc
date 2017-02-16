from django.conf.urls import url

urlpatterns = [
    url(r'^get_year/', 'vtmultiscale.views.get_year', name='get_year'),
]
