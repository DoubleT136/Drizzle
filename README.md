# Drizzle - Winner of Bose Prize at Tufts PolyHack 2016
## By Jeremy Colebrook-Soucie, Matthew Jones, and Tommy Tang

This is a web app made using Python (Pydub Library), Django, D3 JS Library, and the Bose SoundTouch API that enables users to mix and create customized ambient noise tracks with an innovative “clock” interface.
![Alt text](screen_shot.png?raw=true "Screen shot")

#How to run
To use the app, make sure that you have Python, Django, and FFmpeg (https://www.ffmpeg.org/download.html) installed. FFmpeg is a dependency for the Pydub Library used to manipulate the MP3 files. Navigate to the root of the respository and run "python -m SimpleHTTPServer 5000" and "python manage.py runserver" in two separate terminal windows.

#How to use
Navigate to http://localhost:8000. To add a sound, click "Add Ambiance" on the top left. Then, you can drag the track along the ring to control when it's played. The interface works like a clock, and the track starts at 12 o'clock and plays clockwise. Multiple tracks can be added on the same ring. Overlay different tracks to combine them. You can also click on a track to change the volume, with dimmer being quieter and brighter being louder. Once you are done, click the buttons on the bottom-left to play in broswer or download the track.

#Notes regarding the Bose API
To see the implementation for the Bose API, navigate to the Bose-version branch. It uses the Bose Soundtouch 10 API, and is currently not available to the public.
