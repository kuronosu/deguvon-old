import time, datetime
from db.actions import DataBase

while __name__ == '__main__':
    print(datetime.datetime.now(), 'Actualizando recientes')
    rs = 0
    try:
        rs = len(DataBase.update_recents())
    except Exception as e:
        print(datetime.datetime.now(), "ERROR: ", e)
    print(datetime.datetime.now(), 'Recientes actualizados', rs)
    time.sleep(2*60)
