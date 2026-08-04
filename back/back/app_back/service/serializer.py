from rest_framework import serializers
from back.app_back.models import User
import html


class UserSerializer(serializers.ModelSerializer) :
    class Meta:
        model = User
        fields = ['id', 'username', 'last_name', 'email', 'password']

    #On déclare la fonction qui permet de nettoyer les champs
    def clean_input(self, value) :
        return html.escape(value)
    
    #On valide le nom
    def validate_username(self, value) :
        #On appel le fonction pour nettoyer le champ
        cleaned_value = self.clean_input(value)

        #On vérifie que le champs comporte bien les caractères autorisé.
        if not all(char.isalpha() or char == "-" for char in cleaned_value) :
            raise serializers.ValidationError("Le nom d'utilisateur ne doit contenir que des lettres.")
        return cleaned_value
    
    #On défini la fonction pour le prénom
    def validate_last_name(self, value):
        #On appel la fonction pour nettoyer le champ
        cleaned_value = self.clean_input(value)

        #On vérifie qu'il contient les caractères autorisé.
        if not all(char.isalpha() or char in ["-", ""] for char in cleaned_value) :
            raise serializers.ValidationError("Le prénom ne doit contenir ques des caractères autorisé.")
        return cleaned_value
    
    #On défini la fonction pour l'email
    def validate_email(self, value) :
        #On appel la fonction pour nettoyer le champ
        cleaned_value = self.clean_input(value)
        #on vérifie que le champ comporte un @ et un point.
        if cleaned_value.count("@") != 1 or"." not in cleaned_value:
            raise serializers.ValidationError("Adresse e-mail invalide")
        
        #On récupère le nom de domaine de l'email
        domaine = cleaned_value.split("@")[1]
        
        #On établi une liste des noms de domaine accepter
        domaine_accepted = ['gmail.com', 'outlook.com', 'hotmail.com', 'live.com', 'orange.com']

        #On vérifie si le nom de domaine de l'email figure dans cette liste
        if domaine not in domaine_accepted :
            raise serializers.ValidationError("Le nom de domain n'est pas autorisé.")
        
        if not all(char.isalnum() or char in ["@", ".", "-", "_"] for char in cleaned_value) :
            raise serializers.ValidationError("l'e-mail contient des caractères non valides.")

        return cleaned_value

    def validate_password(self, value) :

        #On établie une liste des caractères spéciaux autorisé.
        special_char = {"@", "$", "!", "%", "*", "?", "&"}

        #on vérifie que le mot de passe contient au moins 8 caractères.
        if len(value) < 8 :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins 8 caractères.")
        #On vérifie que le mot de passe contient au moins une majuscule
        if not any(char.isupper() for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une majuscule.")
        
        #On vérifie que le mot de passe contient au moins une minuscule
        if not any(char.islower() for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une lettre minuscule.")
        
        #On vérifie que le mot de passe contient au moins un chiffre
        if not any(char.isdigit() for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins un chiffre.")
        
        #On vérifie que le mot de passe contient au moins un caractère spécial
        if not any(char in special_char for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins un caractères spécial (@, $, !, %, ?, &)")
        
        #On vérifie que le mot de passe ne contient pas de caractères non autorisé.
        if not all(char.isalnum() or char in special_char for char in value) :
            raise serializers.ValidationError("Le mot de passe contient des caractères spéciaux non autorisés.")
        
        return value
    
    def create(self, validated_data): 
        user = User.objects.create_user(**validated_data)
        return user

#On crée le serializer qui permet de valider l'email et le mot de passe   
class LoginSerializer(serializers.Serializer) :

    #On récupère l'email et le mot de passe
    email = serializers.EmailField()
    password= serializers.CharField(write_only=True)

    #On échappe les caractères spéciaux
    def clean_input(self, value) :
        return html.escape(value)
    
    #On vérifie que l'email est correct
    def validate_email(self, value):
        cleaned_value = self.clean_input(value)

        #On vérifie que @ est présent que une seul fois
        if cleaned_value.count("@") != 1 or not "." in cleaned_value:
            raise serializers.ValidationError("Adresse email invalide")
        
        if not all(char.isalnum() or char in ["@", ".", "-", "_"] for char in cleaned_value) :
            raise serializers.ValidationError("L'email contient des caractères invalide.")
        
        #On définit les nom de domaines accepter
        domaine_accepted = ["gmail.com", "outlook.com", "hotmail.com", "live.com", "orange.com"]
        
        #On récupère le nom de domaine de l'email
        domaines = cleaned_value.split("@")[1]

        #On vérifie que le nom de domaine est accepter
        if domaines not in domaine_accepted : 
            raise serializers.ValidationError("Le nom de domaine n'est pas accepter.")
        
        return cleaned_value
    
    #On valide le mot de passe
    def validate_password(self, value) :
        #On définit les caractères spéciaux qui sont autorisé
        special_chars = {"@", "$", "!", "*", "?", "&"}

        #On vérifie si le mot de passe contient au moins 8 caratères.
        if len(value) < 8 :
            raise serializers.ValidationError("le mot de passe doit contenir au moins 8 caractères.")
        
        #On vérifie si il contient au moins une majuscule
        if not any(char.isupper() for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une majuscule.")
        
        #on vérifie si il contien une minuscule
        if not any(char.islower() for char in value) :
            raise serializers.ValidationError("le mot de passe doit contenir au moins une lettre minuscule.")
        
        #On vérifie si il contient au moins chiffre
        if not any(char.isdigit() for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins un chiffre.")
        
        #On vérifie que le mot de passe contient seulement les caractères spéciaux autorisé.
        if not all(char.isalnum() or char in special_chars for char in value) :
            raise serializers.ValidationError(" Le mot de passe contient des caractères spéciaux non autorisé.")
        
        return value
    
class UpdateUserSerializer(serializers.Serializer) :

    username = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()

    #On nettoie les données.
    def clean_input(self, value) : 
        return html.escape(value)
    

    #On valide le username
    def validated_username(self, value) :
        #On appel la fonction pour nettoyer les données
        clenead_value = self.clean_input(value)

        #On vérifie que le champ ne comporte que des lettres.
        if not all(char.isalpha() or not char in ["-", ""] for char in clenead_value) :
            return serializers.ValidationError("Le champ 'Nom' contient des caractères non autorisé.")
        return clenead_value
    
    def validate_last_name(self, value) :
        cleaned_value = self.clean_input(value)

        #On vérifie qu'il contient que des caractères autoris&.
        if not all(char.isalpha() or not char in ["-", ""] for char in cleaned_value):
            return serializers.ValidationError("Le champ 'Prénom contient des caractère non autorisé.")
        return cleaned_value
    
    def validate_email(self, value):
        #On appel la fonction qui nettoie les données.
        cleaned_value = self.clean_input(value)

        #On vérifie que l'email contient un @ et un point
        if cleaned_value.count("@") != 1 or not "." in cleaned_value :
            return serializers.ValidationError("L'email est invalide.")
        
        #On défini les nom de domaine qui sont accepter
        domain_accepted = ["gmail.com", "outlook.com", "hotmail.com"]

        #On récupère le nom de domaine de l'utilisateur
        domain_user = cleaned_value.split("@")[1]

        #On vérifie que le nom de domaine de l'utilisateur est bien dans la liste
        if not domain_user in domain_accepted :
            return serializers.ValidationError("Le nom de domaine n'est pas accepter.")
        
        #On vérifie que l'email ne contient pas de caractères non autorisé
        if not all (char.isalnum() or char in ["-", "_", "@", "."] for char in cleaned_value) :
            return serializers.ValidationError("L'email contient des caractères non autorisé.")
        
        return cleaned_value
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.email = validated_data.get("email", instance.email)

        instance.save()

        return instance
    




        



        


        
        
    

    

