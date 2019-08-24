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
api_router.register(r'directory', api_views.DirectoryViewSet,
                    base_name='directory')

# Wire up our API using automatic URL routing.
urlpatterns = [
    path('api/', include(api_router.urls)),
    path('media/screenshots/<aid>/<episode>/<file>',
         api_views.screenshots, name='screenshots'),
    path('media/uploads/animes/covers/<file>',
         api_views.covers, name='covers'),
    path('media/uploads/animes/banners/<file>',
         api_views.banners, name='banners')
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
