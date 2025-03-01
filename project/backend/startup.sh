virtualenv ../venv
source ../venv/bin/activate

#django package installs
python -m pip install djangorestframework
python -m pip install djangorestframework-simplejwt
python -m pip install django-cors-headers
python -m pip install pandas

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser