from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import BasePermission

class CookieJWTAuthentication(JWTAuthentication) :
    def authenticate(self, request):
        #On récupère le token
        token = request.COOKIES.get("access_token")

        if not token :
            return None
        
        validated_token = self.get_validated_token(token)
        user = self.get_user(validated_token)

        return user, validated_token
    
class IsStaff(BasePermission) :
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff

    
