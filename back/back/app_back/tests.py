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


class MeTest(TestCase):

    def test_me(self):

        user = User.objects.create_user(
            username="Sébastien",
            last_name="Dec",
            email="sebastien@gmail.com",
            password="Password@123",
        )

        client = APIClient()

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

        me_response = client.get("/api/me/")

        print(me_response.status_code)
        print(me_response.content.decode())

        self.assertEqual(me_response.status_code, 401)

        # self.assertEqual(me_response.data["id"], user.id)
        # self.assertEqual(me_response.data["username"], user.username)
        # self.assertEqual(me_response.data["last_name"], user.last_name)

