import os
import peewee as pw

BASE_DIR = os.environ.get('BASE_DIR', os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
DATABASE = pw.SqliteDatabase(os.path.join(BASE_DIR, 'ddbb.sqlite3'))