import readline from 'readline-sync';
import fetch from "node-fetch";
import promptSync from "prompt-sync";
const prompt = promptSync();

//let userPostCode = prompt("Please enter a postcode:")
const stopTypes = "NaptanPublicBusCoachTram";


fetch(`https://api.postcodes.io/postcodes?q=ub55aw`)
    .then(postCodeInfo => postCodeInfo.json())
    .then(function (postCodeInfo) {
        const lon = postCodeInfo.result[0].longitude;
        console.log("Longitude is: " + lon);
        const lat = postCodeInfo.result[0].latitude;
        console.log("Longitude is: " + lat);
        return fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=400`);

    })
    .then(stopPointsList => stopPointsList.json())
    .then(function (stopPointsList) {
   
       // const distance =  Math.round(stopPointsList.stopPoints[0].distance);
       const stops = stopPointsList.stopPoints; //array

        stops.sort((stopPoint1, stopPoint2) => stopPoint1.distance - stopPoint2.distance);
        //const naptanId = stop[0].naptanId;
        
       for (const stopPoint of stops) {
            console.log(`StopPoint ID ${stopPoint.naptanId} is ${stopPoint.distance}m away`);
        }
        const stopPointOneName = stops[0].commonName;
        const stopPointOneId = stops[0].naptanId;
        const stopPointTwoName = stops[1].commonName;
        const stopPointTwoId = stops[1].naptanId;
      //  const stopPointTwoName = stops[1].commonName;

      return fetch(`https://api.tfl.gov.uk/StopPoint/${stopPointTwoId}/Arrivals`);

    })
    .then(buses => buses.json())
    .then(function (buses) {
     //   const lineId = buses[0].lineId;
     //   const direction = buses[0].direction;
    //  const expectedArrivalTime=buses[0].expectedArrival;
        buses.sort((bus1, bus2) => bus1.timeToStation - bus2.timeToStation);
        console.log (`The next bus is ${buses[0].lineId} in the ${buses[0].direction} direction to ${buses[0].destinationName} arriving in ${buses[0].timeToStation} seconds`);
        /*for (const bus of buses ) {
            console.log (`Bus ${bus.lineId} in the ${bus.direction} direction to ${bus.destinationName} arriving in ${bus.timeToStation} seconds`);
        
        } */
    })

