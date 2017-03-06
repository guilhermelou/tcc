import json
import glob
import csv
import os
from datetime import date
from calendar import monthrange
from rainfall.models import Station, Section, SubSection

file_simple = "rainfall/mapas_json/br-states.json"
key_states_simpl = "estados"
key_sp_simpl = "SP"

file_full = "rainfall/mapas_json/br-states-full.json"
key_states_full = "states"
key_sp_full = "35"
bbox = [-53.1096, -25.2505, -44.1606, -19.7793]
center = [-48.6351, -22.5149]

def getSPFromFile(file_name, key_states, key_sp):

    with open(file_name, 'rb') as jsonfile:
        data = json.load(jsonfile)
        objects = data["objects"]
        states = objects[key_states]
        new_geometries = []
        for geometry in states["geometries"]:
            if (geometry["id"] == key_sp):
                geometry["id"] = "SP"
                new_geometries.append(geometry)
        states["geometries"] = new_geometries
        states["bbox"] = bbox
        states["center"] = center
        objects["states"] = states
        objects.pop("estados", None)
    json_data = json.dumps(data)
    return json_data

# getSPFromFile(file_simple, key_states_simpl, key_sp_simpl)
# getSPFromFile(file_full, key_states_full, key_sp_full)

