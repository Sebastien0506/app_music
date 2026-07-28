# from rest_framework_simplejwt.tokens import BlacklistMixin
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.response import Response

# class blacklistedToken(BlacklistMixin) :
#     def blacklist(self, request):
#         #On récupère le token depuis les cookies
#         refresh_token = request.COOKIE.get("refresh_token")
        
#         #On blacklist le token
#         if refresh_token :
#             refresh = RefreshToken(refresh_token)
#             refresh.blacklist()
        
#         #on envoi la reponse
#         response = Response({"success": "Déconnexion réussie."})
        
#         #On supprime les cookie acces_token et refresh_token
#         response.delete_cookie("access_token")
#         response.delete_cookie("refresh_token")
