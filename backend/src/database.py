import os
from psycopg2 import connect
from get_docker_secret import get_docker_secret
from random import randint

# Set environment values
database_name = get_docker_secret(os.environ['DATABASE_DB'])
database_user = get_docker_secret(os.environ['DATABASE_USER'])
database_password = get_docker_secret(os.environ['DATABASE_PASSWORD'])
database_host = "database"
database_port = "5432"


class DatabaseConnection():
    """
    Abstracts the database connection
    """

    def __init__(self):
        """
        Init the connection
        """

        self.connection = connect(user=database_user,
                                  password=database_password,
                                  host=database_host,
                                  port=database_port,
                                  database=database_name)

    def get_cursor(self):
        """
        Returns a cursor
        """

        return self.connection.cursor()

    def close(self):
        """
        Close the connection
        """

        self.connection.close()


def select_random_verb():
    """
    Selects a random verb from database and is returned
    """

    try:
        db_con = DatabaseConnection()
        cursor = db_con.get_cursor()
    except:
        raise Exception("Cannot connect to database.")

    try:
        # Get number of entries
        cursor.execute("SELECT COUNT(*) FROM irregular_verbs")
        (verbs_count,) = cursor.fetchone()

        if verbs_count < 1:
            raise Exception('There\'s no entry in the database.')

        # Get random verb
        cursor.execute(
            f'SELECT infinitive, simple_past, past_participle FROM irregular_verbs WHERE id = {randint(1, verbs_count)}')

        verb = cursor.fetchone()

        return {
            "infinitive": verb[0],
            "simple_past": verb[1],
            "past_participle": verb[2]
        }

    finally:
        db_con.close()
