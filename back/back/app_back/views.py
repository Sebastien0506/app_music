from django.shortcuts import render
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from back.app_back.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response 

@api_view(["POST"])
@ensure_csrf_cookie
def get_csrf(request):
    return Response({"token": get_token(request)})

# def me(request): 

# #On récupère l'utilisateur dans la requête
#     user = request.user
#     #On renvoi les données de l'utilisateur
#     return Response({
#         "id": user.id,
#         "name": user.name,
#         "last_name": user.last_name
#     })

    
