from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from back.app_back.models import Music, Category
from unittest.mock import MagicMock, patch

User = get_user_model()


# class RegisterTest(TestCase):

#     def test_register(self):
#         client = APIClient()

#         response = client.post(
#             "/api/register/",
#             {
#                 "username": "Sébastien",
#                 "last_name": "Dec",
#                 "email": "sebastien@gmail.com",
#                 "password": "Password@123",
#             },
#             format="json",
#         )
#         print(response.status_code)
#         print(response.content.decode())
#         self.assertEqual(response.status_code, 201)
#         self.assertTrue(
#             User.objects.filter(email="sebastien@gmail.com").exists()
#         )

# class LoginTest(TestCase) :
#     def test_login(self) :
#         User.objects.create_user(
#             username="Sébastien",
#             last_name="Dec",
#             email="sebastien@gmail.com",
#             password="Password@123",
#         )

#         client  = APIClient()

#         response = client.post(
#             "/api/login/",
#             {
#                 "email": "sebastien@gmail.com",
#                 "password": "Password@123",
#             },
#             format="json",

#         )
#         print(response.status_code)
#         print(response.content.decode())
#         self.assertEqual(response.status_code, 200)
#         self.assertTrue(User.objects.filter(email="sebastien@gmail.com").exists())


# class MeTest(TestCase):

#     def test_me(self):

#         user = User.objects.create_user(
#             username="Sébastien",
#             last_name="Dec",
#             email="sebastien@gmail.com",
#             password="Password@123",
#         )

#         client = APIClient()

        # login_response = client.post(
        #     "/api/login/",
        #     {
        #         "email": "sebastien@gmail.com",
        #         "password": "Password@123",
        #     },
        #     format="json",
        # )

        # self.assertEqual(login_response.status_code, 200)
        # self.assertIn("access_token", login_response.cookies)

        # me_response = client.get("/api/me/")

        # print(me_response.status_code)
        # print(me_response.content.decode())

        # self.assertEqual(me_response.status_code, 401)

        # self.assertEqual(me_response.data["id"], user.id)
        # self.assertEqual(me_response.data["username"], user.username)
        # self.assertEqual(me_response.data["last_name"], user.last_name)

# class UpdateUser(TestCase) :
#     def test_update_me(self):

#         #On crée l'utilisateur
#         user = User.objects.create_user(
#             username="Sébastien",
#             last_name="Dec",
#             email="dec05@gmail.com"
#         )

#         client = APIClient()
#         client.force_authenticate(user=user)

#         #On fait la requête
#         update_response = client.put(
#             "/api/update_user/",
#             {
#                 "username": "Sébastien",
#                 "last_name": "Dec",
#                 "email": "dec0506@gmail.com"
#             },
#             format="json",
#         )
#         self.assertEqual(update_response.status_code, status.HTTP_200_OK)
#         user.refresh_from_db()

        # self.assertEqual(user.username, 'Sébastien')
        # self.assertEqual(user.last_name, 'Dec')
        # self.assertEqual(user.email, 'dec0506@gmail.com')

#on fait le test pour crée une catégorie
# class CreateCategoryTest(TestCase) :
#     def test_create_category(self) :

#         #On crée l'utilisateur
#         user = User.objects.create_user(
#             username="Sébastien",
#             last_name="Dec",
#             email="dec05@fmail.com",
#             password="Password@1",
#             is_staff=True
#         )
#         client = APIClient()

#         #On connecte de force l'utilisateur
#         client.force_authenticate(user=user)

#         #On créer l'objet catégorie
#         category = Category.objects.create(
#             name = "Rap"
#         )
        

#         #On fait la requête
#         create_category = client.post(
#             "/api/create_category/",
#             {
#                 "name": "Rap"
#             },
#             format="json"
#         )
#         print(create_category.status_code)
#         print(create_category.content.decode())
#         self.assertEqual(create_category.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(category.name, "Rap")
class DeleteCategoryTest(TestCase) :
    def test_delete_category(self) :

        #On crée l'utilisateur
        user = User.objects.create_user(
            username="Sébastien",
            last_name="Dec",
            email="dec05@fmail.com",
            password="Password@1",
            is_staff=True
        )
        client = APIClient()

        #On connecte de force l'utilisateur
        client.force_authenticate(user=user)

        #On créer l'objet catégorie
        category = Category.objects.create(
            id='1',
            name = "Rap"
        )
        

        delete_category = client.delete(
            "/api/delete_category/1/",
            
        )
        print(delete_category.status_code)
        print(delete_category.content.decode())
        self.assertEqual(delete_category.status_code, status.HTTP_200_OK)
        self.assertFalse(
            Category.objects.filter(id=category.id).exists()
        )
        
        
#On fait le test pour voir si sa refuse quand il y a un caractères non autoriser
# class CreateCategoryTest(TestCase) :
#     def test_create_category(self) :

#         #On crée l'utilisateur
#         user = User.objects.create_user(
#             username="Sébastien",
#             last_name="Dec",
#             email="dec05@fmail.com",
#             password="Password@1",
#             is_staff=True
#         )
#         client = APIClient()

#         #On connecte de force l'utilisateur
#         client.force_authenticate(user=user)

#         #On créer l'objet catégorie
#         category = Category.objects.create(
#             name = "Rap"
#         )
        

#         #On fait la requête
#         create_category = client.post(
#             "/api/create_category/",
#             {
#                 "name": "Rap123"
#             },
#             format="json"
#         )
#         print(create_category.status_code)
#         print(create_category.content.decode())
#         self.assertEqual(create_category.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(category.name, "Rap")
        # self.assertEqual(create_category.name, 'Rap')

 #On fait le test pour upload un fichier   
# class AddMusicTest(TestCase):

#     @patch("back.app_back.views.MP3")

#     @patch("back.app_back.views.magic.from_buffer")

#     def test_add_music(self, mock_from_buffer, mock_mp3):

#         user = User.objects.create_user(

#             username="Sébastien",

#             last_name="Dec",

#             email="dec05@gmail.com",

#             password="password123",

#         )

#         client = APIClient()

#         client.force_authenticate(user=user)

#         # On simule python-magic

#         mock_from_buffer.return_value = "audio/mpeg"

#         # On simule Mutagen et une durée de 180 secondes

#         fake_audio = MagicMock()

#         fake_audio.info.length = 180

#         mock_mp3.return_value = fake_audio

#         file = SimpleUploadedFile(

#             name="music.mp3",

#             content=b"fake audio content",

#             content_type="audio/mpeg",

#         )

#         response = client.post(

#             "/api/add_music/",

#             {"music": file},

#             format="multipart",

#         )
#         print(response.status_code)
#         print(response.data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#         self.assertEqual(Music.objects.count(), 1)