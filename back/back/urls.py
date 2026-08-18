"""
URL configuration for back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from back.app_back.views import get_all_music_favorites, add_favorite_music, get_csrf, register, login, me, logout, user_update, add_music, get_all_music, create_category, get_all_category, get_music_category, delete_category, get_all_music, delete_music, get_one_music, update_music
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/me/', me),
    path('api/get_csrf/', get_csrf),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register),
    path('api/login/', login),
    path('api/logout/', logout),
    path('api/update_user/', user_update),
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api/add_music/', add_music),
    path('api/get_all_music/', get_all_music),
    path('api/create_category/', create_category),
    path('api/get_all_category/', get_all_category),
    path('api/get_music_category/<int:category_id>/', get_music_category),
    path('api/delete_category/<int:category_id>/', delete_category),
    path('api/delete_music/<int:music_id>/', delete_music),
    path('api/get_one_music/<int:music_id>/', get_one_music),
    path('api/update_music/<int:music_id>/', update_music),
    path('api/add_favorite_music/<int:music_id>/', add_favorite_music),
    path('api/get_all_music_favorites/', get_all_music_favorites),
]


urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
