from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import os

app = Flask(__name__)
CORS(app)
model = YOLO("yolo11n.pt")

@app.route("/test", methods=['POST','GET'])
def testFunction():
    return jsonify({'message': 'The flask app is up and running'})

@app.route( "/image", methods=['POST'] )
def processImage():

    if 'file' not in request.files: # here file is the key name passed in the json request
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # save the image locally to process
    file.save( "myenv\\imgs\\imageToProcess.jpg" )


    im1 = Image.open("myenv\\imgs\\imageToProcess.jpg")
    results = model.predict(source=im1, save=False)

    objects = results[0].boxes.cls.tolist() # all the detected objects converted to simple list format, contains object key and not name
    # print( results[0].names ) #names of all the detectable classes
    # print( objects ) 


    # variables to store count of different types of vehicle
    countCars = 0
    countBikes = 0
    countBuses = 0
    # all the time is taken as seconds
    minTime = 10 
    maxTime = 50
    processedTime = 0 # variable to calculate the time based on count of vehicles
    timePerInstance = 2.5 # time assumed for one instance of traffic to cross the signal
    noVehiclesPassingPerInstance = 2

    # checks the list and counts each type of vehicle
    for object in objects:
        if( object in [2] ):
            countCars += 1
        elif( object in [ 1, 3 ] ):
            countBikes += 1
        elif( object in [5, 7] ):
            countBuses += 1
    # print( f"Cars = {countCars}\nBikes = {countBikes}\nBuses = {countBuses}" )

    processedTime = int( ((countCars + countBuses)/(noVehiclesPassingPerInstance))*timePerInstance + countBikes//2 )
    processedTime = min( max( minTime, processedTime ), maxTime ) # this keeps the calculated time withing the min-max limits
    # os.remove("myenv\\imgs\\imageToProcess.jpg")

    return jsonify( { 'time' : processedTime, 'cars':countCars, 'buses':countBuses, 'bikes':countBikes } )
    # return response

if __name__ == '__main__':
    app.run()

