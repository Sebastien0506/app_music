from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


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

class LoginTest(TestCase) :
    def test_login(self) :
        User.objects.create_user(
            username="Sébastien",
            last_name="Dec",
            email="sebastien@gmail.com",
            password="Password@123",
        )

        client  = APIClient()

        response = client.post(
            "/api/login/",
            {
                "email": "sebastien@gmail.com",
                "password": "Password@123",
            },
            format="json",

        )
        print(response.status_code)
        print(response.content.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(email="sebastien@gmail.com").exists())

