from django.conf.urls import url
from tutyr_app import views

urlpatterns = [
    url(r'^api/feed$', views.tutyr_list),
    url(r'^api/tutor/(?P<username>\w+)/subjects', views.select_subjects),
    url(r'^api/subjects', views.subjects),
    #url(r'^tutyr_app/(?P<id>[0-9]+)/$', views.tutyr_detail),
    url(r'^api/account/register', views.tutyr_register),
    url(r'^api/account/tutor_mode', views.toggle_tutor_mode),
    url(r'^api/account/profile', views.edit_tutyr_profile),
    url(r'^api/account/profile/(?P<id>[0-9]+)', views.get_tutyr_profile),
    url(r'^api/account/location', views.location),
    url(r'^api/session/(?P<id>[0-9]+)$', views.get_session),
    url(r'^api/session', views.create_session),
    #url(r'^api/rate', views.rating),
]