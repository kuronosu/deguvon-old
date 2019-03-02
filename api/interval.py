import time, datetime, json
from db.actions import DataBase

while __name__ == '__main__':
    print(datetime.datetime.now(), 'Actualizando recientes')
    crs = 0
    last = None
    try:
        rs = DataBase.update_recents()
        crs = len(rs)
        if last is None or last != rs[0]['id']:
            with open('directory.json', 'w') as f:
                directory = DataBase.all()
                directory = json.dumps(directory, indent=None).replace("\\\\\"", "\\\"").replace("\\\\", "\\")
                f.write(directory)
            last = rs[0]['id']
    except Exception as e:
        print(datetime.datetime.now(), "ERROR: ", e)
    print(datetime.datetime.now(), 'Recientes actualizados', crs)
    time.sleep(2*60)
