import fetch from "node-fetch";

import promptSync from "prompt-sync";
const prompt = promptSync();


let userStopCode = prompt("Please enter a bus stop code:")



fetch(`https://api.tfl.gov.uk/StopPoint/${userStopCode}/Arrivals`
    )
    .then(response => response.json())
    .then(body => {
        body.sort((b1, b2) => b1.timeToStation - b2.timeToStation);


        for(const bus of body) {
            console.log(`Bus ${bus.lineId} is coming in ${Math.floor(bus.timeToStation/60)} minutes and ${bus.timeToStation%60} seconds`);
        }

       });