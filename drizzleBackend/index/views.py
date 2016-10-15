from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json

def index(request):
    if request.method == 'POST':
        if request.is_ajax():
            email = request.POST.get('hi')
            data = {"hi":email}
            return JsonResponse(data)
    return render(request,'index.html')
