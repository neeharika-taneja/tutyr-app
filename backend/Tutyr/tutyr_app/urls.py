from django.conf.urls import url
from tutyr_app import views

urlpatterns = [
    url(r'^tutyr_app/$', views.tutyr_list),
    url(r'^tutyr_app/(?P<pk>[0-9]+)/$', views.tutyr_detail),
]