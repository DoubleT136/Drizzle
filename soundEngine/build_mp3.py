from pydub import AudioSegment
import json

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

build_mp3('{"total_time":20, "arcs":[{"filename": "fire.mp3", "theta": 0, "dtheta": 5, "intensity": 1}, {"filename": "thunder.mp3", "theta": 2, "dtheta": 5, "intensity": 1}]}', "test.mp3")
