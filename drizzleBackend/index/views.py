from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pydub import AudioSegment
import json
from django.views.decorators.csrf import csrf_exempt
def add_to_audio(original, overlaid, shift, vol):
    return original.overlay(AudioSegment.silent(1000 * shift) + overlaid.apply_gain(vol))

def add_rem_audio(original, overlaid, rem, vol):
    return add_to_audio(original, overlaid[-rem:], 0, vol)

def build_mp3(data, export_name):
    parsed_data = json.loads(data)
    track = AudioSegment.silent(1000 * parsed_data["total_time"])
    for arc in parsed_data['arcs']:
	track = add_to_audio(track, AudioSegment.from_mp3(arc['filename']), arc['theta'], arc['intensity'])
	if arc['theta'] + arc['dtheta'] > parsed_data['total_time']:
            track = add_rem_audio(track, AudioSegment.from_mp3(arc['filename']), 1000 * (arc['theta'] + arc['dtheta'] - parsed_data['total_time']), arc['intensity'])
    track.export(export_name, format="mp3")
    return


@csrf_exempt
def index(request):
    if request.method == 'POST':
        if request.is_ajax():
            data = request.POST.get('postData')
            build_mp3(data, "test.mp3")
            return JsonResponse({"hi":"hey"})
    return render(request,'index.html')


def drizzle(request):
    return render(request, 'static/drizzle.html')