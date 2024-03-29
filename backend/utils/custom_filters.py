import json
from decimal import Decimal
from datetime import date, timedelta, time
import requests
from django.conf import settings
from math import radians, cos, sin, asin, sqrt


def get_distance_between_points(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    # Radius of earth in miles is 3958.8
    km = 6371 * c
    return km


def filter_queryset_with_distance(
    queryset, distance, origin_longitude, origin_latitude
):
    try:
        distance = int(distance)
        origin_longitude = Decimal(origin_longitude)
        origin_latitude = Decimal(origin_latitude)
        loc_data = {}
        for i in queryset:
            if i.address_longitude and i.address_latitude:
                loc_data[i.id] = {
                    "longitude": i.address_longitude,
                    "latitude": i.address_latitude,
                    "obj": i,
                }
        if loc_data:
            for k, v in loc_data.items():
                loc_data[k]["estimated_distance"] = get_distance_between_points(
                    origin_longitude, origin_latitude, v["longitude"], v["latitude"]
                )
            # print('Location Data', loc_data)
            ids = [
                key
                for key, value in loc_data.items()
                if value["estimated_distance"] < int(distance)
            ]
            queryset = queryset.filter(id__in=ids)
    except Exception as e:
        print(e)
        pass
    return queryset


def filter_events_with_get_param(queryset, request):
    distance = request.query_params.get("distance", None)
    current_latitude = request.query_params.get("current_latitude", None)
    current_longitude = request.query_params.get("current_longitude", None)
    min_cost = request.query_params.get("min_cost", None)
    max_cost = request.query_params.get("max_cost", None)
    categories = request.query_params.getlist("categories", None)
    today = request.query_params.getlist("today", None)
    tomorrow = request.query_params.getlist("tomorrow", None)
    this_week = request.query_params.getlist("this_week", None)
    location = request.query_params.get("location", None)
    start_date = request.query_params.get("start_date", None)
    end_date = request.query_params.get("end_date", None)

    if min_cost and max_cost:
        queryset = queryset.filter(bottle_services__price__range=(min_cost, max_cost)).distinct()

    if categories:
        queryset = queryset.filter(
            categories__name__iregex=r"(" + "|".join(categories) + ")"
        )

    if today:
        today = date.today()
        queryset = queryset.filter(start_date=today)

    if tomorrow:
        tomorrow = date.today() + timedelta(1)
        queryset = queryset.filter(start_date=tomorrow)

    if this_week:
        week_start = date.today()
        week_start -= timedelta(days=week_start.weekday())
        week_end = week_start + timedelta(days=7)
        queryset = queryset.filter(start_date__gte=week_start, start_date__lte=week_end)

    if location:
        queryset = queryset.filter(location__icontains=location)

    if start_date and end_date:
        queryset = queryset.filter(start_date=start_date, end_date=end_date)

    if distance:
        origin_latitude = ""
        origin_longitude = ""
        if current_longitude and current_latitude:
            origin_latitude = current_latitude
            origin_longitude = current_longitude
        else:
            origin_latitude = request.user.address_latitude
            origin_longitude = request.user.address_longitude
        if origin_longitude and origin_latitude:
            queryset = filter_queryset_with_distance(
                queryset, distance, origin_longitude, origin_latitude
            )
    return queryset
