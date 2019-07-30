import time
import click
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
