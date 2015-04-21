from django.conf.urls import url
from tutyr_app import views

urlpatterns = [
    url(r'^api/feed$', views.tutyr_list),
    url(r'^api/user/(?P<username>\w+)', views.tutyr_profile),
    url(r'^api/tutor/(?P<username>\w+)/subjects', views.select_subjects),
    url(r'^api/subjects', views.subjects),
    url(r'^tutyr_app/(?P<pk>[0-9]+)/$', views.tutyr_detail),
    url(r'^api/account/register', views.tutyr_register),
]