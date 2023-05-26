from app import app, populartimes_api, database, score_calculator
from flask import request, render_template

import requests

import os

@app.route("/", methods=['GET', 'POST'])
def index():
    return render_template("index.html")

@app.route("/populartimes", methods=['GET'])
def populartimes():
    place_id = request.args.get('place_id')
    return populartimes_api.getPopularTimes(place_id)

@app.route("/covidsafeScore", methods=['GET'])
def covidsafeScore():
    place_id = request.args.get('place_id')
    # Get number of google reviews
    populartimes_result = populartimes_api.getPopularTimes(place_id)
    google_places_api_accessed = False
    google_places_data = None
    postcode = None
    numRatings = None
    if populartimes_result == None:
        res = requests.get('https://maps.googleapis.com/maps/api/place/details/json?key=%s&place_id=%s', (os.getenv("GOOGLE_API_KEY"), place_id))
        if res.status_code != 200:
            postcode = -1
            print("NOOOOOOOOOOOOO2")
            numRatings = -1
        else:
            google_places_api_accessed = True
            google_places_data = res.json()
            print(google_places_data)
            print("hello world")
            
    

        res = requests.get('https://maps.googleapis.com/maps/api/place/details/json?key=%s&place_id=%s', (os.getenv("GOOGLE_API_KEY"), place_id))
        if res.status_code != 200:
            postcode = -1
            print("NOOOOOOOOOOOOO2")
            numRatings = -1
        else:
            google_places_api_accessed = True
            google_places_data = res.json()
            print(google_places_data)
            print("hello world2")
            try:
                numRatings = google_places_data['user_ratings_total']
            except KeyError as e:
                print("KeyError")
                print(e)
    else:
        try:
            numRatings = populartimes_result['rating_n']
        except KeyError as e:
            print("KeyError")
            print(e)
            numRatings = -1

    reviewScore = score_calculator.calculateNumberOfReviewsCovidScore(numRatings)
    try:
        postcode = populartimes_result['address'][4:]
    except TypeError:
        if google_places_api_accessed == True:
            postcode = google_places_data['formatted_address'].split(',')[-2][-4:]
            print("new post code", postcode)
    healthScore = score_calculator.calculateNSWHealthCovidSafeScore(postcode)
    popularTimesScore = score_calculator.calculateTimeOfDayCovidSafeScore(place_id)
    userRatingScore = score_calculator.calculateUserRatings(place_id)
    allScores = [reviewScore, healthScore, popularTimesScore, userRatingScore]
    scoreWeights = [5, 60, 25, 10]
    totalWeight = 0
    totalScore = 0
    print(allScores)
    for i in range(len(allScores)):
        if allScores[i] != -1:
            totalWeight += scoreWeights[i]
            totalScore += allScores[i]
    if totalWeight == 0:
        return 5    # If no information available at all then it is likely the place is reasonably covid safe
    scaledCovidScore = (totalScore/totalWeight) * 100 # Otherwise return the weighted covid score
    return {
        "score": round(scaledCovidScore)
    }

@app.route("/rating", methods=['GET', 'POST'])
def saveCovidSafeScore():
    # Handle GET case
    if request.method == 'GET':
        return {
            "rating" : 75
        }
    # Handle POST case
    place_id = request.args.get('place_id')
    rating = request.args.get('rating')
    command = "INSERT INTO ratings VALUES(%s, %s)"
    values = (place_id, rating)
    database.execute(command, values)
