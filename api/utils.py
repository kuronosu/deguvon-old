import json
from flask.wrappers import Response

def json_response(data):
    return Response(
        response=json.dumps(data, indent=1)
            .replace("\\\\\"", "\\\"")
            .replace("\\\\", "\\")
            ,
        status=200,
        mimetype='application/json'
    )


def path(rule, **kwargs):
    return (rule, kwargs)
