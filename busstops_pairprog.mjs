import fetch from "node-fetch";

import promptSync from "prompt-sync";
const prompt = promptSync();


let userPostcode = prompt("Please enter your postcode: ")



async function fetchPostcodeInfo() {
    const postcode = await fetch(`https://api.postcodes.io/postcodes?q=${userPostcode}`);
    const postcodeInfo = await postcode.json();
    const lat = postcodeInfo.result[0].latitude;
    const lon = postcodeInfo.result[0].longitude;

    const stopTypes = "NaptanOnstreetBusCoachStopPair,NaptanPublicBusCoachTram";
    const buses = await fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=${stopTypes}&lat=
${lat}&lon=${lon}&radius=400`)
    const busesInfo = await buses.json();

    const stopPointOneName = busesInfo.stopPoints[0].commonName;
    const stopPointTwoName = busesInfo.stopPoints[1].commonName;
    const stopPointOneDistance = Math.round(busesInfo.stopPoints[0].distance);
    const stopPointTwoDistance = Math.round(busesInfo.stopPoints[1].distance);


    console.log(
        `${stopPointOneName} is ${stopPointOneDistance} metres away from ${userPostcode}.
${stopPointTwoName} is ${stopPointTwoDistance} metres away from ${userPostcode}.`)

}



    fetchPostcodeInfo();


     // for(const bus of busesInfo.stopPoints) {
    //     console.log(`${bus.commonName} is ${Math.round(bus.distance)} metres away from ${userPostcode}.`);
    // }