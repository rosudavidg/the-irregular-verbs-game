from flask import Flask, Response, json
from database import select_random_verb

app = Flask(__name__)


@app.route('/verbs/random', methods=['GET'])
def get_random_verb():
    """
    Returns a random verb from database
    """

    try:
        verb = select_random_verb()

        return Response(json.dumps(verb), status=200, mimetype='application/json')
    except:
        return Response("Selecting a random verb failed!", status=500)


if __name__ == "__main__":
    """
    Server entrypoint
    """

    app.run(host="0.0.0.0")
