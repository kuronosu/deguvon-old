from django.urls import include, path
from rest_framework import routers
from api import views as api_views

router = routers.DefaultRouter()
router.register(r'animes', api_views.AnimeViewSet)
router.register(r'genres', api_views.GenreViewSet)
router.register(r'states', api_views.StateViewSet)
router.register(r'types', api_views.TypeViewSet)
router.register(r'recents', api_views.RecentsViewSet, base_name='recents')
router.register(r'directory', api_views.DirectoryViewSet, base_name='directory')

# Wire up our API using automatic URL routing.
urlpatterns = [
    path('api/', include(router.urls)),
]