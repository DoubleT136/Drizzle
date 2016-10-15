import build_mp3

cmshort = add_to_audio(AudioSegment.silent(10000), "cm.mp3", 0, 1)
eotwshort = add_to_audio(AudioSegment.silent(10000), "endoftheworld.mp3", 0, 1)
ayhshort = add_to_audio(AudioSegment.silent(10000), "areyouhappy.mp3", 0, 1)

track = cmshort + eotwshort + ayhshort

track.export("comp.mp3", format="mp3")
