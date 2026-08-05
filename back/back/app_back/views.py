from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from back.app_back.models import User, Music
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response 
from back.app_back.service.serializer import UserSerializer, LoginSerializer, UpdateUserSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from back.app_back import authentication
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.contrib.auth import authenticate
import magic
from mutagen.mp3 import MP3
import uuid
from pathlib import Path
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



@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    #On récupère les données
    email = request.data.get("email")
    password = request.data.get("password")

    #Si il n'y a pas email ou password
    if not email or not password:
        return Response(
            {"errors": "Données manquantes."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    #On initialise le serializer
    serializer = LoginSerializer(
        data={
            "email": email,
            "password": password,
        }
    )
    #Si le serializer n'est pas valide
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
    #On identifie l'utilisateur
    user = authenticate(
        request=request,
        email=email,
        password=password,
    )
    #Si aucun utilisateur
    if user is None:
        return Response(
            {"errors": "Email ou mot de passe incorrect."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    #On génère le token
    tokens = get_token_for_user(user)
    
    #On envoie la response
    response = Response(
        {
            "success": "Connexion réussie.",
            "is_staff": user.is_staff,
        },
        status=status.HTTP_200_OK,
    )
    #On met les cookie dans la response
    response.set_cookie(
        key="access_token",
        value=tokens["access"],
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=300,
    )

    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh"],
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=300,
    )

    return response

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
        "email": user.email,
        "is_staff": user.is_staff,
    })

#View pour reset le password
@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs) :
    #Envoi de l'email a l'utilisateur
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        # 'reset_password_url': "{}?token={}".format(
        #     instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
        #     reset_password_token.key
        # )
        'reset_password_url': (
            f"http://localhost:4200/reset_password"
            f"?token={reset_password_token.key}"
        ),
    }

    #On fait le rendu de l'email
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        #Titre
        "Password Reset for {title}".format(title="Some website title"),
        #Message:
        email_plaintext_message,
        #From
        "noreply@somehost.local",
        #to:
        [reset_password_token.user.email]

    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def user_update(request) :

    #On récupère l'utilisateur
    user = request.user

     #On récupère les données
    username = request.data.get("username")
    last_name = request.data.get("last_name")
    email = request.data.get("email")
    print(username, last_name, email)

    #On vérifie que les donnée ne sont pas vide 
    if not username or not last_name or not email :
        return Response({"error" : "Un champ est manquant."}, status=status.HTTP_400_BAD_REQUEST)
    
    #On initialise le serializer 
    serializer = UpdateUserSerializer(
        instance=user,
        data={
            "username": username,
            "last_name": last_name,
            "email": email
        }
    )

    #Si le serializer est valide
    if serializer.is_valid() :

        serializer.save()

        return Response({"success": "Utilisateur modifier avec succès"}, status=status.HTTP_200_OK)
    else :
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

#On définit la vue pour ajouter une musique
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_music(request) :

    #On récupère l'utilisateur
    user = request.user

    if not user :
        return Response({
            "error" : "Utilisateur introuvable."
        }, status=status.HTTP_400_BAD_REQUEST)

    #On récupère le fichier dans la requête
    file = request.FILES.get("music")

    #Si aucun fichier est trouvé on renvoi une erreur
    if not file :
        return Response({"error": "Aucun fichier"}, status=status.HTTP_400_BAD_REQUEST)
    
    #On vérifie la taille du fichier
    max_size = 100 * 1024 * 1024
    
    if file.size > max_size :
        return Response({"error" : "Le fichier est trop volumineux."}, status=status.HTTP_400_BAD_REQUEST)
    
    #On vérifie que le fichier est accepter
    try:
        mime = magic.from_buffer(file.read(2048), mime=True)
        file.seek(0)

        allowed_types = [
            "audio/mpeg",
            "audio/wav",
            "audio/x-wav",
            "audio/flac",
            "audio/mp4",
            "audio/mp3"
        ]
        if mime not in allowed_types :
            return Response(
                {"error": "Le type du fichier n'est pas autorisé."},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e :
        return Response(
            {"error": f"Impossible d'identifier le fichier: {e}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    #On récupère la durer du fichier
    try:
        audio = MP3(file)
        duration = audio.info.length

    except Exception :
        return Response(
            {"error": "Impossible de lire le fichier audio."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try :
        original_name = Path(file.name).stem
        generate_name = str(uuid.uuid4()) + ".mp3"
        file.name = generate_name
    
    except Exception as e :
        return Response ({
            "error": f"Erreur lors de la génération du nom aleatoire. {e}"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    #On sauvegarde tous
    music = Music.objects.create(
        title=original_name,
        file=file,
        filename=generate_name,
        size=file.size,
        duration=int(duration),
        user=user
    )
    #On retourne un reponse
    return Response(
        {
            "success": "Musique ajoutée avec succès."
        },
        status=status.HTTP_201_CREATED
    )
    # music.save()
    

    

    


