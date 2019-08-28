from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from api import views as api_views

api_router = routers.DefaultRouter()
api_router.APIRootView.__doc__ = "The root for Deguvon api"
api_router.register(r'animes', api_views.AnimeViewSet)
api_router.register(r'genres', api_views.GenreViewSet)
api_router.register(r'states', api_views.StateViewSet)
api_router.register(r'types', api_views.TypeViewSet)
api_router.register(r'recents', api_views.RecentsViewSet, base_name='recents')
api_router.register(r'episodes', api_views.ServeVideoViewSet,
                    base_name='episodes')
api_router.register(r'directory', api_views.DirectoryViewSet,
                    base_name='directory')

media_router = routers.SimpleRouter(trailing_slash=False)
media_router.register(
    r'media', api_views.ServeImagesViewSet, base_name='media')

# Wire up our API using automatic URL routing.
urlpatterns = [
    path('', include(media_router.urls)),
    path('api/', include(api_router.urls)),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
