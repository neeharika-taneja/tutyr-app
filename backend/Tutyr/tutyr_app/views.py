from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from tutyr_app.models import *
from tutyr_app.serializers import *

class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

@csrf_exempt
def tutyr_list(request):
    if request.method == 'GET':
        tutyrs = Tutyr.objects.all()
        serializer = TutyrSerializer(tutyrs, many=True)
        return JSONResponse(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = TutyrSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)
        return JSONResponse(serializer.errors, status=400)

@csrf_exempt
def tutyr_profile(request, username):
    try:
        tutyr = Tutyr.objects.get(facebook_id=username)
    except:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = TutyrSerializer(tutyr)
        return JSONResponse(serializer.data)
    else:
        return HttpResponse(status=400)


@csrf_exempt
def tutyr_detail(request, pk):
    try:
        tutyr = Tutyr.objects.get(pk=pk)
    except Tutyr.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = TutyrSerializer(tutyr)
        return JSONResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = TutyrSerializer(tutyr, data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data)
        return JSONResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        tutyr.delete()
        return HttpResponse(status=204)

@csrf_exempt
def select_subjects(request, username):
    try:
        tutyr = Tutyr.objects.get(facebook_id=username)
    except Tutyr.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'POST':
        data = JSONParser().parse(request)
        subjects = data.subjects
        subject_list = Subject.objects.filter(subject_id__in=subjects)
        tutyr.subjects = subject_list
        tutyr.save()
        serializer = TutyrSerializer(tutyr)
        if serializer.is_valid():
            return JSONResponse(serializer.data)
    serializer = TutyrSerializer(tutyr)
    return JSONResponse(serializer.data)

@csrf_exempt
def subjects(request):
    if request.method == 'GET':
        subject_list = Subject.objects.all()
        serializer = SubjectSerializer(subject_list, many=True)
        return JSONResponse(serializer.data)

    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = SubjectSerializer(data=data,)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data)
        return JSONResponse(serializer.errors, status=400)