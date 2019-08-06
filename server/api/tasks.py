# Create your tasks here
from celery import shared_task
from celery.decorators import periodic_task
from scrape.main import get_recents
from api.utils import verify_recents


@shared_task
def add(x, y):
    return x + y

@periodic_task(run_every=60*2)
def update_recents():
    """Task to get and update the recents""" 
    r = get_recents()
    r = verify_recents(r)