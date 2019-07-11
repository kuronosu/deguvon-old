import sys
import time
import click
import os
from db.actions import DataBase
from scrape.utils import generate_cookies

BASE_DIR = os.environ.get('BASE_DIR', os.path.abspath(os.path.dirname(__file__)))
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

# class Menus:
#     """Clase que contiene todos los menus de la app"""

#     @staticmethod
#     def main_menu():
#         salida = False
#         print("\n\t BIENVENIDO!")
#         while True:
#             print("""
#         Si desea salir luego de ejecutar una instruccion agrege 's' en la instruccion.\n
#         1: Actualizar toda la base de datos.
#         2: Actualizar animes en emision.
#         3: Ver anime.
#         4: Salir.
#         """
#                   )
#             e = input("Seleccione una opción: ").lower()
#             if 's' in e:
#                 salida = True
#                 e = e.replace("s", "")
#             if e == "1":
#                 t = time.time()
#                 DataBase.update_database()
#                 print(time.time() - t)
#                 if salida:
#                     sys.exit(0)
#             elif e == "2":
#                 DataBase.update_animes_in_emision()
#                 if salida:
#                     sys.exit(0)
#             elif e == "3":
#                 Menus.animes_menu()
#                 if salida:
#                     sys.exit(0)
#             elif e == "4":
#                 sys.exit(0)
#             else:
#                 print("Entrada no valida.")

#     @staticmethod
#     def animes_menu():
#         while True:
#             print("""
#         1: Buscar un anime.
#         2: Listar animes.
#         3: Menu anterior.
#         """
#                   )
#             e = input("Seleccione una opción: ").lower()
#             if e == "1":
#                 name = input("Nombre del anime: ")
#                 [print(i.name) for i in DataBase.search(name)]

#             elif e == "2":
#                 print(2)
#             elif e == "3":
#                 return
#             else:
#                 print("Entrada no valida.")

if __name__ == '__main__':
    try:
        cli()
    except Exception as e:
        click.secho("Bye", fg='bright_blue', err=True)
    # DataBase.create_tables()
    # generate_cookies()
    # if len(sys.argv) >= 2 and sys.argv[1] == '-u':
    #     DataBase.update_database()
    # else:
    #     Menus.main_menu()
