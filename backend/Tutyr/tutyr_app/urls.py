from django.conf.urls import url
from tutyr_app import views

urlpatterns = [
    url(r'^api/feed$', views.tutyr_list),
    url(r'^api/tutor/(?P<username>\w+)/subjects', views.select_subjects),
    url(r'^api/subjects', views.subjects),
    url(r'^tutyr_app/(?P<pk>[0-9]+)/$', views.tutyr_detail),
    url(r'^api/account/register', views.tutyr_register),
    url(r'^api/account/tutor_mode', views.toggle_tutor_mode),
    url(r'^api/account/profile', views.tutyr_profile)
]