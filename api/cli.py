import sys
import time
import click
import os

from db.actions import DataBase
from scrape.utils import generate_cookies

BASE_DIR = os.environ.get(
    'BASE_DIR', os.path.abspath(os.path.dirname(__file__)))
os.environ['BASE_DIR'] = BASE_DIR


def setup(get_cookies=True):
    DataBase.connect()
    try:
        click.secho("Checking db", fg='blue')
        DataBase.create_tables()
        click.secho("Verified db", fg='green')
    except:
        click.secho('Database could not be created')
        exit(1)
    if get_cookies:
        try:
            click.secho("Getting cookies", fg='blue')
            generate_cookies()
            click.secho("Loaded cookies", fg='green')
        except:
            click.secho("Error loading cookies", fg='red')
            exit(1)


@click.group()
def cli():
    setup()


@cli.command()
@click.option('-D', '--drop', default=False, help='Drop the DB and recreate', is_flag=True)
def fill(drop):
    if drop:
        click.secho("Dropping db", fg='yellow')
        DataBase.close()
        os.remove(os.path.join(BASE_DIR, 'ddbb.sqlite3'))
        # os.remove(os.path.join(BASE_DIR, 'cookies'))
        setup(False)
    t = time.time()
    DataBase.update_database()
    print(time.time() - t)


@cli.command()
def init():
    pass


if __name__ == '__main__':
    try:
        cli()
    except Exception as e:
        click.secho("Bye", fg='bright_blue', err=True)
