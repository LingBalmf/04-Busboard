import readline from 'readline-sync';
import fetch from "node-fetch";
import promptSync from "prompt-sync";
const prompt = promptSync();


async function validatePostCode(postcode) {
    let valid;
    try {
        const fetchValidate = await fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`);
        const validateUserPostcode = await fetchValidate.json();
        valid = validateUserPostcode.result;
        console.log(`Valid is ${valid}`);

        if (valid === false) {
            throw new Error(`It looks like ${postcode} isn't a valid postcode.`)
        }
        return true;
    }
    catch (error) {
        console.error(error.message);
        return false;
    }
}

async function getLocation(postCode) {
    try {
        const response = await fetch(`https://api.postcodes.io/postcodes?q=${postCode}`);
        const location = await response.json();
        return {
            lon: location.result[0].longitude,
            lat: location.result[0].latitude
        }

    } catch(error) {
        console.error('Failed to retrieve location information:', error.message);
    }
  
}

async function getStopPoints(lon, lat, stopPointIdx) {
    const stopTypes = "NaptanPublicBusCoachTram";
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=400`);
    const stopPointsList = await response.json();
    const stops = stopPointsList.stopPoints; //array
    stops.sort((stopPoint1, stopPoint2) => stopPoint1.distance - stopPoint2.distance);
    return stops[stopPointIdx].naptanId;
}

async function listFirstArrival(stopId, busIndex) {
    try {
        const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals`);
        const buses = await response.json();
        let counter = 0;

        buses.sort((bus1, bus2) => bus1.timeToStation - bus2.timeToStation);
        console.log(`Buses.length is ${buses.length}`);

        if (buses.length === 0) {
            throw new Error(`No next bus listed for stop  ${stopId}`);
        } else {
            console.log(`The next bus for stop ID ${stopId} is ${buses[busIndex].lineId} in the ${buses[busIndex].direction} 
            direction to ${buses[busIndex].destinationName} arriving in ${buses[busIndex].timeToStation} seconds`);
        }
    } catch (error) {
        console.error('Something went wrong!', error.message);
    }
}

let validPostcode = false;
let userPostCode
do {
    userPostCode = prompt("Please enter a postcode:")
    validPostcode = await validatePostCode(userPostCode);
} while (!validPostcode)

await getLocation(userPostCode);
const lonLat = await getLocation(userPostCode);
const stopOneId = await getStopPoints(lonLat.lon, lonLat.lat, 0);
const stopTwoId = await getStopPoints(lonLat.lon, lonLat.lat, 1);
await listFirstArrival(stopOneId, 0); // first bus arriving at stop 1
await listFirstArrival(stopTwoId, 0); // first bus arriving at stop 2