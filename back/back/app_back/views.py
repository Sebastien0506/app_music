from django.shortcuts import render
from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from back.app_back.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response 
from back.app_back.service.serializer import UserSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed

@api_view(["POST"])
@ensure_csrf_cookie
def get_csrf(request):
    return Response({"token": get_token(request)})

#On génère le token jwt
def get_token_for_user(user):
    #On vérifie que l'utilisateur est actif
    if not user.is_active:
        raise AuthenticationFailed("Utilisateur non connecté")
    #on génère le token
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }
#On crée la fonction pour l'inscription
@api_view(["POST"])
def register(request) : 

    #On récupère les données de l'utilisateur depuis la requête
    username: str = request.data.get("username")
    last_name: str = request.data.get("last_name")
    email: str = request.data.get("email")
    password: str = request.data.get("password")

    #On vérifie que tous les champs soit rempli
    if not username or not last_name or not email or not password: 
        return Response({"error": "Un ou plusieurs champs sont manquants."}, status=status.HTTP_400_BAD_REQUEST)

        
    
    #On appel le serializer
    serializer =  UserSerializer(data={
        "username": username,
        "last_name": last_name,
        "email": email,
        "password": password
    })
    #On vérifie que le serializeur est valide
    if serializer.is_valid():
       #Si il est valide on le sauvegarde
       user = serializer.save()

       #On appel la fonction pour générer le token jwt
       tokens = get_token_for_user(user)

       response = Response(
           {"success": "Utilisateur crée avec succès."},
           status=status.HTTP_201_CREATED
       )
       #On met dans les cookie le token jwt
       response.set_cookie(
           key="access_token",
           value=tokens["access"],
           httponly=True,
       )
       response.set_cookie(
           key="refresh_token",
           value=tokens["refresh"],
           httponly=True
       )
       #On retourne la reponse 
       return response
        

    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


    # else:
    #     return Response(
    #         serializer.errors,
    #         status=status.HTTP_400_BAD_REQUEST
    #     )
    
    
    
    







# def me(request): 

# #On récupère l'utilisateur dans la requête
#     user = request.user
#     #On renvoi les données de l'utilisateur
#     return Response({
#         "id": user.id,
#         "name": user.name,
#         "last_name": user.last_name
#     })

    
