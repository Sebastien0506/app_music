from django.shortcuts import render
from django.http import HttpResponse
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

#On crée la fonction pour l'inscription
def register(request) : 

    #On récupère les données de l'utilisateur depuis la requête
    name: str = request.data.get("name")
    last_name: str = request.data.get("last_name")
    email: str = request.data.get("email")
    password: str = request.data.get("password")

    #On vérifie que tous les champs soit rempli
    if name or last_name or email or password < len(1) : 
        response = HttpResponse("Un ou plusieurs chanmps sont manquant")

        return response
    
     



# def me(request): 

# #On récupère l'utilisateur dans la requête
#     user = request.user
#     #On renvoi les données de l'utilisateur
#     return Response({
#         "id": user.id,
#         "name": user.name,
#         "last_name": user.last_name
#     })

    
