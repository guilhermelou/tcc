import json
import glob
import csv
import os
from datetime import date
from calendar import monthrange
from rainfall.models import Station, Section, SubSection



# dict containing all the data
data = {}
# dict containing the stations
stations = {}
# attaching stations to all data
data["stations"] = stations
# iterating over rain files in the folder
for file_name in glob.glob("rainfall/estacoes_chuva/*.dat"):
    # getting the base name from file path
    base_name = os.path.basename(file_name)
    # dict to store each station
    station = {}
    # array of years
    years = []
    # getting only the name without extension
    prefix = base_name[:6]
    # attaching the station to a prefix inside the stations dict
    stations[prefix] = station
    # attaching section info to station
    station["section"] = base_name[0]
    # attaching subsection info to station
    station["subsection"] = int(base_name[1])
    # attaching subsubsection info to station
    station["subsubsection"] = int(base_name[3:6])
    # attaching average info to station
    station["average"] = 0
    # attaching day_amount info to station
    station["day_amount"] = 0
    # attaching amount info to station
    station["amount"] = 0
    # attaching null_days info to station
    station["null_days"] = 0
    # attaching years array info to station
    station["years"] = years

    with open(file_name, 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=';', quotechar='"')
        # var to track the number of current year over the iterations
        year_nmb = 0
        # running over the lines
        for i, row in enumerate(spamreader):
            # Removing the first two lines
            if i>1:
                # running over the columns
                for counter, column in enumerate(row):
                    # first column is the number of the year
                    if counter==0:
                        # if the year_nmb is diferent from the first column a
                        # new year started
                        if year_nmb != int(column):
                            # creating and cleaning the year and months var
                            year = {}
                            year["day_amount"] = 0
                            year["amount"] = 0
                            year["null_days"] = 0
                            months = []
                            # updating the year_nmb with column
                            year_nmb = int(column)
                            # settig the key year with the year_nmb
                            year["year"] = year_nmb
                            # appending the year into the years array
                            years.append(year)
                            # setting the month key with the months array
                            # that will be filled forward
                            year["months"] = months
                    # second column is the number of the month
                    elif counter==1:
                        # creating and cleaning the month and days var
                        month = {}
                        month["day_amount"] = 0
                        month["amount"] = 0
                        month["null_days"] = 0
                        days = []
                        # settig the key month with the column
                        month["month"] = int(column)
                        # appending the month into the months array
                        months.append(month)
                        # settig the key days with the days array that will be
                        # filled forward
                        month["days"] = days
                    # the rest of columns is the days
                    else:
                        # day_amount is loaded with the number of days in the
                        # specific month
                        day_amount = monthrange(year["year"], month["month"])[1]
                        # if the number of days in the file is wrong we
                        # check with the right amount of days of the month
                        if counter < day_amount+2:
                            # creating and cleaning the day var
                            day = {}
                            # setting the day_average with the column
                            # converted to int
                            day_average = int(column)
                            # if the day_average is over than 999 that is
                            # because there are no data, we switch to -1
                            # and add null_days on month, year and station
                            if day_average > 999:
                                day_average = -1
                                month["null_days"] = month["null_days"] + 1
                                year["null_days"] = year["null_days"] + 1
                                station["null_days"] = station["null_days"] + 1
                            # if not just add the amount of day_average
                            # to do the month, year and station average after
                            else:
                                month["amount"] = month["amount"] + day_average
                                year["amount"] = year["amount"] + day_average
                                station["amount"] = (
                                        station["amount"] +
                                        day_average
                                    )
                            # setting the day key var with the day number of
                            # the month
                            day["day"] = counter - 1
                            # setting the day_average key with the day_average
                            day["day_average"] = day_average
                            # add the day on days array
                            days.append(day)
                            # setting the day_amount key on month, year and
                            # station
                            month["day_amount"] = month["day_amount"] + 1
                            year["day_amount"] = year["day_amount"] + 1
                            station["day_amount"] = station["day_amount"] + 1
    '''
    if base_name == "A6-001.dat":
        break
        # json_data = json.dumps(data)
        # print json_data
    '''

# var with the file name of the geo info for the stations
postos_file_name = 'rainfall/estacoes_geo/postos.csv'
# opening file as csv
with open(postos_file_name, 'rb') as csvfile:
    # starting the reader with a spamreader by row
    spamreader = csv.reader(csvfile, delimiter=';', quotechar='"')
    # cleaning the station var
    station = {}
    # running over the lines
    for i, row in enumerate(spamreader):
        # Removing the first two lines
        if i>1:
            # running over the columns
            for counter, column in enumerate(row):
                # first column is the number of the year
                if counter==0:
                    # if station key exists add, if not continue to next itera
                    try:
                        station = stations[column]
                    except:
                        continue
                # second column is the name of the station
                elif counter == 1:
                    station["name"] = column
                # third column is the city of the station
                elif counter == 2:
                    station["city"] = column
                # fourth column is the basin of the station
                elif counter == 3:
                    station["basin"] = column
                # fifth column is the altitude of the station
                elif counter == 4:
                    station["alt"] = int(column)
                # sixth column is the latitude of the station
                elif counter == 5:
                    # converting into new coordinate system
                    station["lat"] = float(convert_coordinate(column))
                    # Old version
                    # station["lat"] = int(column)
                # seventh column is the longitude of the station
                elif counter == 6:
                    # converting into new coordinate system
                    station["long"] = float(convert_coordinate(column))
                    # Old version
                    # int(column)
                # octave column is the initial year of the station
                elif counter == 7:
                    station["year_ini"] = int(column)
                # ninth column is the final year of the station
                elif counter == 8:
                    station["year_end"] = int(column)
                # tenth column is the range of the station
                elif counter == 9:
                    station["range"] = int(column)
                # eleventh column is the consistency of the station
                elif counter == 10:
                    # creating a array from a wrong formated string
                    column.split("/")
                    consistency = map(int, column.split("/"))
                    station["consistency"] = consistency

# calculating the average
for station_key in stations:

    station = stations[station_key]
    valid_days = station["day_amount"] - station["null_days"]
    if valid_days > 0:
        station["average"] = (
            float(station["amount"]) / valid_days
        )
    else:
        station["average"] = -1
    for year in station["years"]:
        valid_days = year["day_amount"] - year["null_days"]
        if valid_days > 0:
            year["average"] = (
                float(year["amount"]) / valid_days
            )
        else:
            year["average"] = -1
        for month in year["months"]:
            valid_days = month["day_amount"] - month["null_days"]
            if valid_days > 0:
                month["average"] = (
                    float(month["amount"]) / valid_days
                )
            else:
                month["average"] = -1

# passing through real database
for station_key in stations:

    station = stations[station_key]
    section = None
    sub_section = None
    try:
        section = Section.objects.get(name=station['section'])
    except:
        section = Section.objects.create(name=station['section'])
    try:
        sub_section = SubSection.filter(
                section__name=station['section']
            ).get(
                code=station['subsection']
            )
    except:
        sub_section = SubSection.objects.create(
                section=section, code=station['subsection']
            )
    try:
        Station.objects.get(prefix=station_key)
    except:
        Station.objects.create(
                prefix = station_key,
                sub_section = sub_section,
                code = station['subsubsection'],
                name = station['name'],
                city = station['city'],
                basin = station['basin'],
                alt = station['alt'],
                lat = station['lat'],
                long = station['long'],
                year_ini = station['year_ini'],
                year_end = station['year_end'],
                range = station['range'],
                day_amount = station['day_amount'],
                null_days = station['null_days'],
                amount = station['amount'],
                average = station['average'],
                consistency = station['consistency'],
                years = station['years']
            )

json_data = json.dumps(data)
# print json_data

