import os
import time
import click
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "deguvon.settings")


@click.group()
def cli():
    pass


@cli.command()
def fill():
    django.setup()
    from api.utils import create_directory
    t = time.time()
    create_directory()
    click.secho(f'La operacion duró {time.time() - t} segundos')


@cli.command()
def cache_directory():
    django.setup()
    from api.utils import cache_directory_soft
    click.secho(f'Creando directory.json', fg='green')
    t = time.time()
    cache_directory_soft()
    click.secho(f'La operacion duró {time.time() - t} segundos')


def recents(v):
    django.setup()
    from api.utils import cache_directory_soft, verify_recents
    from scrape.main import get_recents
    try:
        t = time.time()
        if v:
            click.secho("Saving", fg='blue')
        r = get_recents()
        verify_recents(r)
        cache_directory_soft(v)
        click.secho(f'Saved in {abs(t-time.time()):.2f}s', fg='green')
    except Exception as e:
        click.secho(f'{e}', fg='red', err=True)


def validate_time(ctx, param, value):
    if value > 0:
        return value
    raise click.BadParameter('"-t" / "--time" must be integer positive')


@cli.command()
@click.option('-v/--verbose', default=False)
@click.option('-t', '--time', 't', default=120, type=int, show_default=True,
              callback=validate_time)
def interval(v, t):
    while True:
        recents(v)
        if v:
            click.secho(f'waiting {t} seconds', fg='blue')
        time.sleep(t)


if __name__ == '__main__':
    cli()
