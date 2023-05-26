import psycopg2, os

def fetch(command, values):
    connection = psycopg2.connect(user="covidsafe",
                                password=os.getenv("db_password"),
                                host="localhost",
                                port="5432",
                                database="covidsafe")
    cursor = connection.cursor()
    cursor.execute(command, values)
    result = cursor.fetchall()
    if (connection):
        cursor.close()
        connection.close()
    return result

def execute(command, values):
    connection = psycopg2.connect(user="covidsafe",
                                password=os.getenv("db_password"),
                                host="localhost",
                                port="5432",
                                database="covidsafe")
    cursor = connection.cursor()
    cursor.execute(command, values)
    connection.commit()
    if (connection):
        cursor.close()
        connection.close()