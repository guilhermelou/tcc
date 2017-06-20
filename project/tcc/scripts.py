'''import os
from optparse import OptionParser

usage = "usage: %prog -s SETTINGS | --settings=SETTINGS"
parser = OptionParser(usage)
parser.add_option('-s', '--settings', dest='settings', metavar='SETTINGS',
                  help="The Django settings module to use")
(options, args) = parser.parse_args()
if not options.settings:
    parser.error("You must specify a settings module")

os.environ['DJANGO_SETTINGS_MODULE'] = options.settings
'''

import os
import django
import json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tcc.settings")
django.setup()

from rainfall.models import Station, Section, SubSection
print json.dumps(Station.objects.all().first().years)
# RAW query
from django.core import serializers
stations = Station.objects.raw('WITH years_data AS (SELECT *, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years where (st_years->>\'year\')::int = 1959) SELECT DISTINCT ON (id) * FROM years_data WHERE (st_years->>\'average\')::float > 50')
data = serializers.serialize("json", stations)
