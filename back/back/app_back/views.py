from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from back.app_back.models import User, Music, Category
from rest_framework.permissions import IsAuthenticated, AllowAny
from .authentication import IsStaff
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response 
from back.app_back.service.serializer import UserSerializer, LoginSerializer, UpdateUserSerializer, CreateCategorySerializer, UpdateMusicSerializer
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
from django.http.response import FileResponse
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
@permission_classes([IsAuthenticated, IsStaff])
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
    
    #On récupère l'id
    category_ids = request.data.getlist('category_id')

    #Si aucune catégorie on renvoi un message d'erreur
    if not category_ids :
        return Response({
            "error": "Aucun catégorie a été fournis."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    #On vérifie la taille du fichier
    max_size = 100 * 1024 * 1024
    
    #On vérifie que la taille du fichier ne dépasse pas celle autorisée
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
        #On vérifie que le type mime du fichier est autorisée
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
    #On génère un nom aléatoirement
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
        user=user,
        
    )
    #On enregistre les catégories de la musique
    categories = Category.objects.filter(id__in=category_ids)
    music.category.set(categories)
    #On retourne un reponse
    return Response(
        {
            "success": "Musique ajoutée avec succès."
        },
        status=status.HTTP_201_CREATED
    )
    # music.save()
    

#On crée la vue pou récupérer toutes les musiques
@api_view(["GET"])
def get_all_music(request) :
    
    #On récupère toutes les musiques
    musiques = Music.objects.all()

    if not musiques.exists() :
        return Response({
            "error": "Aucun musiques enregistrer."
        }, status=status.HTTP_400_BAD_REQUEST)
    #On déclare le variable data a un tableau vide 
    data = []
    #On parcoure chaque musiques
    for music in musiques :
        #On déclare la variable categories à un tableau vide
        categories = []
        #POur chaque musique on récupère toutes leur catégories
        for category in music.category.all() :
            #On donne à la variable categories l'id et le nom des categories
            categories.append(
                {
                    "id": category.id,
                    "name": category.name
                }
            )
        
    
        #On donne à la variable data toutes les informations des musiques
        data.append(
            {
                "id": music.id,
                "title": music.title,
                "duration": music.duration,
                "size": music.size,
                "category": categories,
            }
        )
    #On envoi la reponse 
    return Response(data, status=status.HTTP_200_OK)

#On crée la fonction pour ajouter une catégorie
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_category(request):

    #On récupère l'utilisateur
    user = request.user
    #On vérifie si l'utilisateur est authentifier
    if not user : 
        return Response({"error": "Utilisateur introuvable."}, status=status.HTTP_400_BAD_REQUEST)
    #On vérifie si l'utilisateur qui veut crée la catégorie à le rôle necessaire.
    if not user.is_staff :
        return Response({"error": "Vous n'avez pas le droit d'ajouter une catégorie"}, status=status.HTTP_403_FORBIDDEN)
    
    #On récupère les données depuis la requête
    name_category = request.data.get("name")
    #On vérifie si le nom de la catégorie est fourni
    if not name_category :
        return Response({"error": "Aucun nom de catégorie fourni."}, status=status.HTTP_400_BAD_REQUEST)
    
    #On initialize un serializer
    serializer = CreateCategorySerializer(
        data={
            "name": name_category
        }
    )
    #Si le serializer est valide on sauvegarde les données et on envoie la reponse
    if serializer.is_valid() :
        serializer.save()

        return Response({"succes": "Catégorie crée avec succès."}, status=status.HTTP_201_CREATED)
    
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_category(request) :

    #On récupère toutes les catégories
    category = Category.objects.all()

    #On définit category_name sur un tableau vide
    category_name = []

    #Pour chaque catégori on récupère sont nom
    for categorie in category :
        category_name.append(
            {
                "id": categorie.id,
                "name": categorie.name
            } 
        )

    return Response(
        category_name, status=status.HTTP_200_OK
    )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsStaff])
def delete_category(request, category_id):

    #On récupère la catégorie par son id
    category = Category.objects.filter(id=category_id)
    
    #Si elle n'existe pas on renvoi un message d'erreur
    if not category.exists() :
        return Response(
            {
                "error": "La catégorie sélectionner n'existe pas."
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    #On supprime la catégorie
    category.delete()
    return Response(
        {
            "success" : "Categorie supprimer avec succès."
        },
        status=status.HTTP_200_OK
    )



@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsStaff])
def delete_music(request, music_id):

    #On récupère la musique par sont id 
    music = Music.objects.filter(id=music_id)

    #Si la musique n'existe pas on retourne une erreur
    if not music.exists() :
        return Response(
            {
                "error": "Aucune musique trouvé."
            },
            status = status.HTTP_400_BAD_REQUEST
        )
    #On supprime la musique
    music.delete()

    return Response(
        {
            "succès" : "Musique supprimer avec succès."
        },
        status=status.HTTP_200_OK
    )

#Permet de récupérer les info d'une musique
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_one_music(request, music_id):

    music = Music.objects.filter(id=music_id).first()

    if not music :
        return Response(
            {
                "error": "Impossible de trouvé la musique."
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    categories = music.category.all()

    music_category = []

    for category in categories :
        music_category.append(
            {
                "id": category.id,
                "name": category.name,
            }
        )
    

    return Response(
        {
            "id": music.id,
            "title": music.title,
            "duration": music.duration,
            "size": music.size,
            "category": music_category,
            "file": music.file.url,
        },
        status=status.HTTP_200_OK
    )


#on fait la view pour update les musiques
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsStaff])
def update_music(request, music_id) :
    #on récupère l'id de la musique
    music = Music.objects.filter(id=music_id).first()

    if not music :
        return Response (
            {
                "error" : "Acune musique trouvé."
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    #on récupère les données de la musique
    title: str = request.data.get("title")
    category_ids: list[int] = request.data.get('category_ids')

#Si un champs est manquant on renvoi un message d'erreur
    if not title or not category_ids : 
        return Response(
            {
                "error": "Un champ est manquant."
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    
    #On initialise le serializer
    serializer = UpdateMusicSerializer(
        data = {
            "id": music.id,
            "title": title
        }
    )

    if not serializer.is_valid() :
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    try :
        music.title = serializer.validated_data["title"]
        music.save()

        categories = Category.objects.filter(id__in=category_ids)
        music.category.set(categories)
            

    except Exception as e: 
        return Response(
            {
                "error" : f"Impossible de modifier la musique: {e}" 
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    return Response(
        {
            "success" : "Musique modifier avec succès"
        },
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_favorite_music(request, music_id):

    #On récupère l'utilisateur
    user = request.user

    #On récupère la musique par son id
    music = Music.objects.filter(id=music_id).first()

    if not music :
        return Response(
            {
                "error" : "Aucune musique trouvé."
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.favorites.add(music)
    return Response(
        {
            "success": "Musique ajoutée au favori."
        },
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_music_favorites(request) :

    #On récupère l'utilisateur
    user = request.user

    #On récupère toutes les musiques favorites de l'utilisateur
    favorites_music = user.favorites.all()

    #On pour chaque musique on récupère son titre
    music_favorites = [] 
    for music in favorites_music :
        music_favorites.append(
            {
                "id": music.id,
                "title": music.title,
                "size": music.size,
                "duration": music.duration,
                'file': music.file.url,
                'category': [
                    {
                        "id": cat.id,
                        "name": cat.name,
                    }
                    for cat in music.category.all()
                ],
            }
        ) 

    #On retourne la réponse
    return Response(
        music_favorites,
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_music(request, music_id) :

    #On récupère la musique par son id
    music = Music.objects.filter(id=music_id).first()

    if not music :
        return Response(
            {
                "error": "Musique introuvable."
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    extension = music.filename.split(".")[-1]

    download_name = f"{music.title}.{extension}"

    return FileResponse(
        music.file.open('rb'),
        as_attachment=True,
        filename=download_name
    )

#PERMET DE RÉCUPÉRER LES MUSIQUES PRÉSENT DANS UNE CATÉGORIE
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_music_category(request, category_id):

    category = Category.objects.filter(id=category_id).first()

    if not category:
        return Response(
            {"error": "Aucune catégorie trouvée."},
            status=status.HTTP_400_BAD_REQUEST
        )

    musics = Music.objects.filter(category__id=category_id)

    if not musics.exists():
        return Response(
            {"error": "Aucune musique dans la catégorie"},
            status=status.HTTP_400_BAD_REQUEST
        )

    music_category = []

    for music in musics:
        music_category.append({
            "id": music.id,
            "title": music.title,
            "duration": music.duration,
            "file": music.file.url,
            "size": music.size,
            "category": {
                "id": category.id,
                "name": category.name
            }
        })

    return Response(
        music_category,
        status=status.HTTP_200_OK
    )

    






    


