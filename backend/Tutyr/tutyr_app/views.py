# TODO: send distance with tutyr_list

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from tutyr_app.models import *
from tutyr_app.serializers import *
from datetime import datetime
from geopy.distance import vincenty

class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

def options_response():
    response = HttpResponse("")
    response['Access-Control-Allow-Origin'] = "*"
    response['Access-Control-Allow-Methods'] = "POST, OPTIONS"
    response['Access-Control-Allow-Headers'] = "X-Requested-With"
    response['Access-Control-Max-Age'] = "1800"
    return response

@csrf_exempt
def tutyr_list(request, facebook_id):
    if request.method == 'GET':
        tutyr = Tutyr.objects.get(facebook_id=facebook_id)
        subject_str = request.GET.get('subject', '')
        latitude = request.GET.get('latitude', '')
        longitude = request.GET.get('longitude', '')

        # All tutors
        queryset = Tutyr.objects.filter(tutor_mode=True)

        # Update relative distance for all tutors
        for tutor in queryset.all():
            position = (tutyr.latitude, tutyr.longitude)
            tutor_position = (tutor.latitude, tutor.longitude)
            distance = vincenty(position, tutor_position).miles
            tutor.distance = distance
            tutor.save()

        # Filter by subject
        if len(subject_str) > 0:
            subject_list = subject_str.split(',')
            for subject in subject_list:
                queryset = queryset.filter(subjects__name=subject)

        # Filter by custom location
        if len(latitude) > 0 and len(longitude) > 0:
            for tutor in queryset.all():
                position = (latitude, longitude)
                tutor_position = (tutor.latitude, tutor.longitude)
                distance = vincenty(position, tutor_position).miles
                tutor.distance = distance
                tutor.save()
                if distance > 10:
                    queryset = queryset.exclude(pk=tutor.pk)

            queryset = queryset.order_by('distance')

        serializer = TutyrSerializer(queryset, many=True)
        return JSONResponse(serializer.data)
    return HttpResponse(status=400)

@csrf_exempt
def edit_tutyr_profile(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        try:
            tutyr = Tutyr.objects.get(facebook_id=data['facebook_id'])
            tutyr.bio1 = data['bio1']
            tutyr.bio2 = data['bio2']
            tutyr.bio3 = data['bio3']
            new_subjects = data['subjects']
            tutyr.subjects = Subject.objects.filter(name__in=new_subjects)
            tutyr.hourly_rate = data['hourly_rate']
            tutyr.save()
            serializer = TutyrSerializer(tutyr)
            return JSONResponse(serializer.data)
        except:
            return HttpResponse(status=404)
    else:
        return HttpResponse(status=400)

@csrf_exempt
def get_tutyr_profile(request, id):
    try:
        tutyr = Tutyr.objects.get(facebook_id=id)
        serializer = TutyrSerializer(tutyr)
        return JSONResponse(serializer.data)
    except:
        return HttpResponse(status=404)

@csrf_exempt
def select_subjects(request, username):
    if request.method == 'OPTIONS':
        return options_response()
    try:
        tutyr = Tutyr.objects.get(facebook_id=username)
    except Tutyr.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'POST':
        data = JSONParser().parse(request)
        subjects = data['subjects']
        subject_list = Subject.objects.filter(subject_id__in=subjects)
        tutyr.subjects = subject_list
        tutyr.save()
        serializer = TutyrSerializer(data=tutyr)
        if serializer.is_valid():
            return JSONResponse(serializer.data)
    serializer = TutyrSerializer(tutyr)
    return JSONResponse(serializer.data)

@csrf_exempt
def subjects(request):
    if request.method == 'OPTIONS':
        return options_response()
    if request.method == 'GET':
        subject_list = Subject.objects.all()
        serializer = SubjectSerializer(subject_list, many=True)
        return JSONResponse(serializer.data)

    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = SubjectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data)
        return JSONResponse(serializer.errors, status=400)

@csrf_exempt
def tutyr_register(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        fb_id = data['fbID']
        tutyr_list = Tutyr.objects.filter(facebook_id=fb_id)
        # User not in database, so create a new user
        if len(tutyr_list) == 0:
            new_tutyr = Tutyr.objects.create(facebook_id=fb_id,
                                             profile_pic=data['profileimage'],
                                             real_name=data['realname'],
                                             registration_date=datetime.now(),
                                             bio1="", bio2="", bio3="",
                                             rating=0.0, num_ratings=0,
                                             hourly_rate=0.0,
                                             tutor_mode=False,
                                             email=data['email'])
            new_tutyr.save()
            serializer = TutyrSerializer(new_tutyr)
            return JSONResponse(serializer.data)

        # Already in database -> return profile
        else:
            tutyr = tutyr_list[0]
            serializer = TutyrSerializer(tutyr)
            return JSONResponse(serializer.data)
    return HttpResponse(status=400)

@csrf_exempt
def toggle_tutor_mode(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == "POST":
        data = JSONParser().parse(request)
        new_tutor_mode = data['tutor_mode']
        tutyr = Tutyr.objects.get(facebook_id=data['facebook_id'])
        if new_tutor_mode:
            tutyr.tutor_mode = True
        else:
            tutyr.tutor_mode = False
        tutyr.save()
        serializer = TutyrSerializer(tutyr)
        return JSONResponse(serializer.data)
    return HttpResponse(status=400)

@csrf_exempt
def location(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        try:
            tutyr = Tutyr.objects.get(facebook_id=data['fbID'])
            latitude = data['latitude']
            longitude = data['longitude']
            tutyr.latitude = latitude
            tutyr.longitude = longitude
            tutyr.save()
            return JSONResponse({'status':'true'})
        except:
            return JSONResponse({'status':'false'})
    return JSONResponse({'status':'method'})

@csrf_exempt
def create_session(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        tutor_from = Tutyr.objects.get(facebook_id=data['fbID_from'])
        tutor_to = Tutyr.objects.get(facebook_id=data['fbID_to'])
        comments = data['comments']
        session = TutorRequest(status=0, tutor_from=tutor_from,
                               tutor_to=tutor_to, comments=comments,
                               timestamp=datetime.now())
        session.save()
        serializer = TutorRequestSerializer(session)
        return JSONResponse(serializer.data)
    return HttpResponse(status=400)

@csrf_exempt
def get_session(request, id):
    if request.method == 'GET':
        try:
            session = TutorRequest.objects.get(id=id)
            serializer = TutorRequestSerializer(session)
            return JSONResponse(serializer.data)
        except:
            return HttpResponse(status=404)
    return HttpResponse(status=400)

@csrf_exempt
def get_sessions_for_tutor(request, id):
    if request.method == 'GET':
        # By default, get all sessions for the tutor
        tutyr = Tutyr.objects.get(facebook_id=id)
        session_list = TutorRequest.objects.filter(tutor_to=tutyr)

        # Filter value present
        if request.GET.get('filt'):
            filt = request.GET.get('filt').split(',')
            session_list = session_list.filter(status__in=filt)
        serializer = TutorRequestSerializer(session_list, many=True)
        return JSONResponse(serializer.data)
    return HttpResponse(status=400)

@csrf_exempt
def rate(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        
        # Do not allow multiple ratings for session
        curRating = Rating.objects.filter(session_id=data['session_id'])
        if len(curRating) > 0:
            if (curRating[0].fbID_to == data['fbID_to'] or
                curRating[0].fbID_from == data['fbID_from']):
                return JSONResponse({'status':'false'})

        # Create a new rating
        serializer = RatingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        tutor = Tutyr.objects.get(facebook_id=data['fbID_to'])
        if tutor.num_ratings == 0:
            tutor.rating = data['rating']
            tutor.num_ratings = 1
            tutor.save()
        else:
            tutor.rating = ((tutor.rating * tutor.num_ratings) + data['rating']) / (tutor.num_ratings + 1)
            tutor.num_ratings = tutor.num_ratings + 1
            tutor.save()
        return JSONResponse({'status':'true'})
    return HttpResponse(status=400)

@csrf_exempt
def get_ratings_for_tutor(request, id):
    if request.method == 'GET':
        ratings = Rating.objects.filter(fbID_to=id)
        serializer = RatingSerializer(ratings, many=True)
        for item in serializer.data:
            tutor = Tutyr.objects.get(facebook_id=item['fbID_from'])
            item['name_from'] = tutor.real_name
        return JSONResponse(serializer.data)
    return HttpResponse(status=400)

@csrf_exempt
def session_status(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        session = TutorRequest.objects.get(id=data['id'])
        session.status = data['status']
        session.save()
        serializer = TutorRequestSerializer(session)
        return JSONResponse(serializer.data)
    return HttpResponse(status=400)

@csrf_exempt
def session_start(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        session = TutorRequest.objects.get(id=data['id'])
        session.session_start = datetime.now()
        session.save()
        tutor = Tutyr.objects.get(id=session.tutor_to.id)
        tutor.busy = True
        tutor.save()
        return JSONResponse({'status':'true'})
    return HttpResponse(status=400)

@csrf_exempt
def session_end(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        session = TutorRequest.objects.get(id=data['id'])
        session.session_end = datetime.now()
        session.save()
        tutor = Tutyr.objects.get(id=session.tutor_to.id)
        tutor.busy = False
        tutor.save()
        return JSONResponse({'status':'true'})
    return HttpResponse(status=400)

@csrf_exempt
def session_location(request):
    if request.method == 'OPTIONS':
        return options_response()
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        session = TutorRequest.objects.get(id=data['id'])
        if 'latitude' in data:
            session.location_latitude = data['latitude']
        if 'longitude' in data:
            session.location_longitude = data['longitude']
        if 'comments' in data:
            session.location_comments = data['comments']
        session.save()
        serializer = TutorRequestSerializer(session)
        return JSONResponse(serializer.data)
    return HttpResponse(status=400)



