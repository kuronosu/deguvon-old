from django.urls import include, path
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'animes', views.AnimeViewSet)
router.register(r'genres', views.GenreViewSet)
router.register(r'states', views.StateViewSet)
router.register(r'types', views.TypeViewSet)
router.register(r'recents', views.RecentsViewSet, base_name='recents')

# Wire up our API using automatic URL routing.
urlpatterns = [
    path('api/', include(router.urls)),
]