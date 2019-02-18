from db.actions import DataBase
from scraping.utils import generate_tokens
import sys, time

class Menus:
    """Clase que contiene todos los menus de la app"""

    @staticmethod
    def main_menu():
        salida = False
        print("\n\t BIENVENIDO!")
        while True:
            print("""
        Si desea salir luego de ejecutar una instruccion agrege 's' en la instruccion.\n
        1: Actualizar toda la base de datos.
        2: Actualizar animes en emision.
        3: Ver anime.
        4: Salir.
        """
            )
            e = input("Seleccione una opción: ").lower()
            if 's' in e:
                salida = True
                e = e.replace("s", "")
            if e == "1":
                t = time.time()
                DataBase.update_database()
                print(time.time() - t)
                if salida:
                    sys.exit(0)
            elif e == "2":
                DataBase.update_animes_in_emision()
                if salida:
                    sys.exit(0)
            elif e == "3":
                Menus.animes_menu()
                if salida:
                    sys.exit(0)
            elif e == "4":
                sys.exit(0)
            else:
                print("Entrada no valida.")

    @staticmethod
    def animes_menu():
        while True:
            print("""
        1: Buscar un anime.
        2: Listar animes.
        3: Menu anterior.
        """
            )
            e = input("Seleccione una opción: ").lower()
            if e == "1":
                name = input("Nombre del anime: ")
                [print(i.name) for i in DataBase.search(name)]

            elif e == "2":
                print(2)
            elif e == "3":
                return
            else:
                print("Entrada no valida.")

if __name__ == '__main__':
    DataBase.create_tables()
    generate_tokens()
    Menus.main_menu()
