import json
from flask.wrappers import Response

def json_response(data, indent=1):
    return Response(
        response=json.dumps(data, indent=indent)
            .replace("\\\\\"", "\\\"")
            .replace("\\\\", "\\")
            ,
        status=200,
        mimetype='application/json'
    )


def path(rule, **kwargs):
    return (rule, kwargs)

def remove_key(dict_obj, key):
    if key in dict_obj:
        del dict_obj[key]
    return dict_obj
