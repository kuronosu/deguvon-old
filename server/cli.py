import os
import time
import click
import django
from scrape.main import get_anime

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "deguvon.settings")
django.setup()

from api.models import Anime
from api.utils import create_directory


@click.group()
def cli():
    pass


@cli.command()
def fill():
    t = time.time()
    create_directory()
    click.secho(f'La operacion duró {time.time() - t} segundos')


if __name__ == '__main__':
    cli()
