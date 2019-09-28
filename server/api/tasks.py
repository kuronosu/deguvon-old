# Create your tasks here
from click import secho
from celery import shared_task
from celery.decorators import periodic_task
from scrape.main import get_recents
from api.utils import verify_recents, cache_directory_soft


@shared_task
def add(x, y):
    """TEST TASK"""
    return x + y


@periodic_task(run_every=60*2)
def update_recents():
    """Task to get and update the recents"""
    try:
        r = get_recents()
        verify_recents(r)
        cache_directory_soft()
    except Exception as e:
        # TODO looger
        secho(f'{e}', fg='red')
