import json
import glob
import csv
import os
from datetime import date
from calendar import monthrange

data = {}
stations = {}
data["stations"] = stations

for file_name in glob.glob("estacoes_chuva/*.dat"):
    # print file_name
    base_name = os.path.basename(file_name)

    # print base_name
    # print base_name[0]
    # print base_name[1]
    # print base_name[3:6]


    station = {}
    # array of years
    years = []

    prefix = base_name[:6]
    stations[prefix] = station
    station["section"] = base_name[0]
    station["subsection"] = int(base_name[1])
    station["subsubsection"] = int(base_name[3:6])
    station["average"] = 200
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
                            # and add null_days on month and year
                            if day_average > 999:
                                day_average = -1
                                month["null_days"] = month["null_days"] + 1
                                year["null_days"] = year["null_days"] + 1
                            # if not just add the amount of day_average
                            # to do the month and year average after
                            else:
                                month["amount"] = month["amount"] + day_average
                                year["amount"] = year["amount"] + day_average
                            # setting the day key var with the day number of
                            # the month
                            day["day"] = counter - 1
                            # setting the day_average key with the day_average
                            day["day_average"] = day_average
                            # add the day on days array
                            days.append(day)
                            # setting the day_amount key on month and year
                            month["day_amount"] = month["day_amount"] + 1
                            year["day_amount"] = year["day_amount"] + 1
    '''
    if base_name == "A6-001.dat":
        break
        # json_data = json.dumps(data)
        # print json_data
    '''

postos_file_name = 'estacoes_geo/postos.csv'
with open(postos_file_name, 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=';', quotechar='"')
    station = {}
    # running over the lines
    for i, row in enumerate(spamreader):
        # Removing the first two lines
        if i>1:
            # running over the columns
            for counter, column in enumerate(row):
                # first column is the number of the year
                if counter==0:
                    data
                    try:
                        station = stations[column]
                    except:
                        break
                elif counter == 1:
                    station["name"] = column
                elif counter == 2:
                    station["city"] = column
                elif counter == 3:
                    station["basin"] = column
                elif counter == 4:
                    station["alt"] = int(column)
                elif counter == 5:
                    station["lat"] = int(column)
                elif counter == 6:
                    station["long"] = int(column)
                elif counter == 7:
                    station["year_ini"] = int(column)
                elif counter == 8:
                    station["year_end"] = int(column)
                elif counter == 9:
                    station["range"] = int(column)
                elif counter == 10:
                    column.split("/")
                    consistency = map(int, column.split("/"))
                    station["consistency"] = consistency

json_data = json.dumps(data)
print json_data

