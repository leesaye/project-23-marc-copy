from django.urls import path
from . views import *

urlpatterns = [
    path('', ContactView.as_view(), name='contacts_page'),
    path('add', AddContactView.as_view(), name='add_contacts_page'),
    path('relationship-quiz/<uuid:contact_id>/', RelationshipQuizView.as_view(), name='relationship-quiz')
]
