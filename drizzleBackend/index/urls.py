from django.conf.urls import url

from . import views

urlpatterns = [
#	url(r'^script', views.script),
    url(r'^$', views.index)
    

]
