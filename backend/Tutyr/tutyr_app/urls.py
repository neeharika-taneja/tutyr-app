from django.conf.urls import url
from tutyr_app import views

urlpatterns = [
    url(r'^api/feed/(?P<facebook_id>\w+)', views.tutyr_list),
    url(r'^api/tutor/(?P<username>\w+)/subjects', views.select_subjects),
    url(r'^api/subjects$', views.subjects),
    url(r'^api/account/register', views.tutyr_register),
    url(r'^api/account/tutor_mode', views.toggle_tutor_mode),
    url(r'^api/account/profile$', views.edit_tutyr_profile),
    url(r'^api/account/profile/(?P<id>[0-9]+)', views.get_tutyr_profile),
    url(r'^api/account/location', views.location),
    url(r'^api/session$', views.create_session),
    url(r'^api/session/(?P<id>[0-9]+)$', views.get_session),
    url(r'^api/sessions_for/(?P<id>[0-9]+)$', views.get_sessions_for_tutor),
    url(r'^api/rate', views.rate),
    url(r'^api/ratings_for/(?P<id>[0-9]+)$', views.get_ratings_for_tutor),
    url(r'^api/session_status$', views.session_status),
    url(r'^api/session_start$', views.session_start),
    url(r'^api/session_end$', views.session_end),
    url(r'^api/session/location$', views.session_location)
]