from rest_framework.pagination import PageNumberPagination

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10  # valeur par défaut
    page_size_query_param = 'page_size'  # clé utilisée dans l'URL
    max_page_size = 100  # limite de sécurité
    page_query_param = 'page'  
