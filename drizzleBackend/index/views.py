from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pydub import AudioSegment
import json
import os
from django.views.decorators.csrf import csrf_exempt
def add_to_audio(original, overlaid, shift, vol):
    return original.overlay(AudioSegment.silent(1000 * shift) + overlaid.apply_gain(vol))

def add_rem_audio(original, overlaid, rem, vol):
    return add_to_audio(original, overlaid[-rem:], 0, vol)


nameFileMap = {
    "Fire" : "media/fire.mp3",
    "Forest" : "media/forest.mp3",
    "Rain" : "media/rain.mp3",
    "Thunder" : "media/thunder.mp3",
    "Waterfall" : "media/waterfall.mp3"
}

def build_mp3(data, export_name):
    print("DATA", data)
    parsed_data = json.loads(data)
    print("PARSED",parsed_data)
    track = AudioSegment.silent(1000 * parsed_data["total_time"])
    for arc in parsed_data['arcs']:
	track = add_to_audio(track, add_to_audio(AudioSegment.silent(1000 * arc['timeDuration']), AudioSegment.from_mp3(nameFileMap[arc['name']]), 0, 0).fade_out(500), arc['timeStart'], arc['intensity'])
	if arc['timeStart'] + arc['timeDuration'] > parsed_data['total_time']:
            track = add_rem_audio(track, add_to_audio(AudioSegment.silent(1000 * arc['timeDuration']), AudioSegment.from_mp3(nameFileMap[arc['name']]), 0, 0).fade_out(500),
                                  1000 * (arc['timeStart'] + arc['timeDuration'] - parsed_data['total_time']), arc['intensity'])
    track.export(export_name, format="mp3")
    return


@csrf_exempt
def index(request):
    if request.method == 'POST':
        if request.is_ajax():
            print(request.POST.items())
            data = request.POST.get('post_data')
            build_mp3(data, "sample.mp3")
            fname="sample.mp3"
            f = open(fname,"rb")
            response = HttpResponse()
            response.write(f.read())
            response['Content-Type'] ='audio/mp3'
            response['Content-Length'] =os.path.getsize(fname )
            return response


            return JsonResponse({"hi":"hey"})
    return render(request,'index.html')


#def script(request):


def drizzle(request):
    return render(request, 'static/drizzle.html')