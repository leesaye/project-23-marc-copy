# Dev Installation Guide

## Backend Installation 
1. Clone Repo
2. Cd into project/backend
3. run startup.sh script
	1. This will create a virtualenv called venv in the root project director and activate it
	2. This will pip install djangorestframework, djangorestframework-simplejwt, django-cors-headers
	3. This will make django migrations 
	4. This will migrate the migrations
	5. This will prompt you to create a superuser
	6. When prompted to create a super user just enter
		1. username = superuser
		2. email = superuser@email.com
		3. password = 123
		4. retype password = 123
		5. override password restrictions = y
4. Run the run.sh afterwards to start the backend server
5. Here you can visit the admin page on port 8000 and use your superuser creds to login
6. You can also use the api endpoints
