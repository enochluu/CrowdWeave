import requests, csv, os, psycopg2

CSV_URL='https://data.nsw.gov.au/data/dataset/97ea2424-abaf-4f3e-a9f2-b5c883f42b6a/resource/2776dbb8-f807-4fb2-b1ed-184a6fc2c8aa/download/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv'

connection = psycopg2.connect(user="covidsafe",
                                 password="Covidsafe2020",
                                 host="localhost",
                                 port="5432",
                                 database="covidsafe")
cursor = connection.cursor()
cursor.execute("TRUNCATE infections", ())


with requests.Session() as s:
    download = s.get(CSV_URL)

    decoded_content = download.content.decode('utf-8')

    cr = csv.reader(decoded_content.splitlines(), delimiter=',')
    my_list = list(cr)
    for row in my_list:
        command = 'INSERT INTO infections VALUES (%s, %s, %s, %s, %s, %s, %s)'
        values = (row[0], row[1], row[2], row[3], row[4], row[5], row[6])
        cursor.execute(command, values)

connection.commit()
cursor.close()
connection.close()
