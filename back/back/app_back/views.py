from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from back.app_back.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response 
from back.app_back.service.serializer import UserSerializer, LoginSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from back.app_back import authentication


# @api_view(["GET"])
# @permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({"token": get_token(request)})

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
           secure=False,
           samesite="Lax",
           max_age=300
       )
       response.set_cookie(
           key="refresh_token",
           value=tokens["refresh"],
           httponly=True,
           secure=False,
           samesite="Lax",
           max_age=300
       )
       #On retourne la reponse 
       return response
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )



#On crée la fonction pour la connexion
@api_view(["POST"])
# @authentication_classes([])
@permission_classes([AllowAny])
def login(request) :

    #On récupère les données de l'utilisateur
    email: str = request.data.get("email")
    password: str = request.data.get("password")
     
    #On vérifie que les données sont présentes
    if not email or not password :
        return Response(
            {
                "errors": "Données manquant."
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    #on initialise le serializer
    serializer = LoginSerializer(
        data = {
            "email": email,
            "password": password
        }
    )

    #On vérifie que le serializer est valide
    if serializer.is_valid() :

        #On récupère l'utilisateur
        user = User.objects.get(email=email)

        #On vérifie que l'utilisateur est bien présent en db
        if not user :
            return Response(
                {
                    "errors": "Aucun utilisateur trouvé."
                }, 
                status=status.HTTP_404_NOT_FOUND
            )
        #On génère le token
        tokens = get_token_for_user(user)

        #On envoie la reponse
        response = Response(
            {"success": "Connexion réussie.",
             "is_staff": user.is_staff},
            status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="access_token",
            value=tokens["access"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=300
        )

        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=300
        )
        return response
    else :
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(["POST"])

@permission_classes([IsAuthenticated])
def logout(request) :

    refresh_token = request.COOKIES.get("refresh_token")

    if refresh_token :
        refresh = RefreshToken(refresh_token)
        refresh.blacklist()
    response = Response({"success": "Déconnexion réussie."})
    
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return response



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request): 
    
#On récupère l'utilisateur dans la requête
    user = request.user
    #On renvoi les données de l'utilisateur
    return Response({
        "id": user.id,
        "username": user.username,
        "last_name": user.last_name,
        "is_staff": user.is_staff
    })

  
