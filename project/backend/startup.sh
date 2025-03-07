virtualenv ../venv
source ../venv/bin/activate

#django package installs
python -m pip install djangorestframework
python -m pip install djangorestframework-simplejwt
python -m pip install django-cors-headers
python -m pip install pandas
python -m pip install google-genai
python -m pip install google-api-core
python -m pip install drf-spectacular

#deployment packages
python -m pip install dj-database-url
python -m pip install psycopg2-binary 
python -m pip install gunicorn

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser