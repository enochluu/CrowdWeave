import livepopulartimes, json, os
import app.database

def getPopularTimes(id):
    command = "SELECT * FROM places WHERE place_id = %s"
    values = (id,)
    result_db = app.database.fetch(command, values)
    if (len(result_db) == 0):
        print(os.getenv("GOOGLE_API_KEY"))
        result = livepopulartimes.get_populartimes_by_PlaceID(os.getenv("GOOGLE_API_KEY"), id)
        
        json_string = json.dumps(result)
        command = "INSERT INTO places (place_id, popular_times_response) VALUES (%s, %s)"
        values = (id, json_string)
        app.database.execute(command, values,)
        return result
    return json.loads(result_db[0][1])


if __name__ == '__main__':
    print(json.dumps(getPopularTimes("ChIJQXBWbSCjEmsRV51peXqvQJ0")))