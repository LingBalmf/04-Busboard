import readline from 'readline-sync';
import fetch from "node-fetch";
import promptSync from "prompt-sync";
const prompt = promptSync();

let userPostCode = prompt("Please enter a postcode:")

const stopTypes = "NaptanPublicBusCoachTram";

function listFirstArrival (stopId) {
     fetch(`https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals`)
    .then(buses => buses.json())
    .then(function (buses) {
        let counter = 0;
        buses.sort((bus1, bus2) => bus1.timeToStation - bus2.timeToStation);
        console.log(`Buses.length is ${buses.length}` );
        
        if (buses.length === 0) {
            console.log(`No next bus listed for stop  ${stopId}`);
        } else {
        console.log (`The next bus for stop ID ${stopId} 
            is ${buses[0].lineId} in the ${buses[0].direction} 
            direction to ${buses[0].destinationName} 
            arriving in ${buses[0].timeToStation} seconds`);
        }
    })
}

fetch(`https://api.postcodes.io/postcodes?q=${userPostCode}`)
    .then(postCodeInfo => postCodeInfo.json())
    .then(function (postCodeInfo) {
        const lon = postCodeInfo.result[0].longitude;
        console.log("Longitude is: " + lon);
        const lat = postCodeInfo.result[0].latitude;
        console.log("Latitude is: " + lat);
        return fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=400`);

    })
    .then(stopPointsList => stopPointsList.json())
    .then(function (stopPointsList) {
   
       // const distance =  Math.round(stopPointsList.stopPoints[0].distance);
       const stops = stopPointsList.stopPoints; //array

        stops.sort((stopPoint1, stopPoint2) => stopPoint1.distance - stopPoint2.distance);
        //const naptanId = stop[0].naptanId;
        
       for (const stopPoint of stops) {
            console.log(`StopPoint ID ${stopPoint.naptanId} name ${stopPoint.commonName} is ${Math.round(stopPoint.distance)} metres away`);
        }
 
        const stopPointOneId = stops[0].naptanId;
        const stopPointTwoId = stops[1].naptanId;
        listFirstArrival(stopPointOneId);
        listFirstArrival(stopPointTwoId);

    

    })