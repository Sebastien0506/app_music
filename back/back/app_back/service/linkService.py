from urllib.parse import urlparse
from rest_framework.response import Response
from rest_framework import status


def checkLink(discord_link, twitch_link, tiktok_link, youtube_link) :

    hostname_link = []

    try :
        #VERIFICATION POUR LE LIEN D'INVITATION DISCORD
        #Si le lien discord est présent
        if discord_link :
            #On récupère le hostname
            url_discord = urlparse(discord_link)
            #On met le hostname de discord dans le tableau
            hostname_link.append(
                url_discord.hostname
            )

            #Si le protocole n'est pas https
            if url_discord.scheme != "https" :
                return Response(
                    {
                       "error" : "Le protocole de discord n'est pas valide"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            #on récupère les pathname de discord
            pathname_discord = url_discord.path[1:]

            #On vérifie le pathname
            if not pathname_discord.isalnum():
                return Response(
                    {
                        "error" : "Caractères non autorisée."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        #VERIFICATION POUR LE LIEN TWITCH
        #On vérifie si le lien twitch est dispo
        if twitch_link :
            #On récupère le hostname 
            url_twitch = urlparse(twitch_link)

            #On met le hostname dans le tableau
            hostname_link.append(
                url_twitch.hostname
            )

            #On récupère le pathname
            pathname_twitch = url_twitch.path[1:]

            #On vérifie les caractères
            if not pathname_twitch.isalnum() :
                return Response(
                    {
                        "error": "Caractères non autorisée."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            #On vérifie le protocole https
            if url_twitch.scheme != "https" :
                return Response(
                    {
                        "error" : "Le protocole https n'est pas valide."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        #VERIFICATION POUR TIKTOK
        #On vérifie si on a le lien tiktok
        if tiktok_link :
            #On récupère le hostname
            url_tiktok = urlparse(tiktok_link)
            #On met le hostname dans le tableau vide
            hostname_link.append(
                url_tiktok.hostname
            )

            #On vérifie le protocole https
            if url_tiktok.scheme != "https":
                return Response(
                    {
                        "error" : "Le protocole https n'est pas valide."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            #On récupère le pathname
            pathname_tiktok: str = url_tiktok.path[1:]

            if not pathname_tiktok.startswith("@") :
                return Response (
                    {"error" : "Le lien Tiktok doit commencer par @."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            #On vérifie les caractères
            if not all(char.isalnum() or char in ["@"] for char in pathname_tiktok) :
                return Response(
                    {
                        "error" : "Caractères non autorisée."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            #VERIFICATION POUR LE LIEN YOUTUBE
            #Si le lien youtube est présent
        if youtube_link : 
            #On récupère les hostname
            url_youtube = urlparse(youtube_link)
                
            #On donne au tableau vide le hostname de youtbe
            hostname_link.append(
                url_youtube.hostname
            )

            #On vérifie le protocole https
            if url_youtube.scheme != "https" :
                return Response(
                    {
                            "error" : "Le protocole https n'est pas valide."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            #On récupère les pathname
            pathname_youtube: str = url_youtube.path[1:]

            if not pathname_youtube.startswith("@") : 
                return Response (
                    {
                        "error" : "Le lien Youtube doit commencer par un @."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            #On vérifie les caractères 
            if not all(char.isalnum() or char in ["@"] for char in pathname_youtube) : 
                return Response(
                    {
                            "error" : "Caractères non autorisée."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        #On définit les hostname autorisée
        allowed_hostname = [
            "www.tiktok.com",
            "www.discord.com",
            "www.twitch.tv",
            "www.youtube.com",
            "discord.gg",
        ]  

        #Pour tous les hostname dans hostname_link
        for hostname in hostname_link :
            if  hostname not in allowed_hostname :
                return Response(
                    {
                        "error" : "Le hostname n'est pas autorisée."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        #si toutes les données sont correct on renvoi True
        return True
    
    except Exception as e :
        return Response(
            {
               "error" : f"Erreur lors de la validation des lien {e}"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    


