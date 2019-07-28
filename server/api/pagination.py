from rest_framework.pagination import PageNumberPagination


class AnimeSetPagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = 'page_size'
    max_page_size = 24
