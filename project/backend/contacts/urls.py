from django.urls import path
from . views import *

urlpatterns = [
    path('', ContactView.as_view(), name='contacts_page'),
    path('add', AddContactView.as_view(), name='add_contacts_page'),
    path('<uuid:contact_id>', IndividualContactView.as_view(), name='individual-contact'),
    path('<uuid:contact_id>/delete', DeleteContactView.as_view(), name='delete-contact'),
    path('<uuid:contact_id>/relationship-quiz', RelationshipQuizView.as_view(), name='relationship-quiz'),
    path('googlesync', AddGoogleContactsView.as_view(), name='sync-google-contacts'),
    path("importcsv/", UploadLinkedInCSVView.as_view(), name="upload-contacts-csv")
]
