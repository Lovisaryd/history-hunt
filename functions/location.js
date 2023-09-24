import axios from "axios"

API_KEY = "YOUR_API_HERE"

import customMap from '../customMap.json'

export const createLocation = ({ markers }) => {
    const markerStrings = markers.map((marker, index) => {
        const label = String(index + 1);
        return `markers=color:purple%7Clabel:${label}%7C${marker.lat},${marker.long}`;
    });
    const styles = encodeURIComponent(JSON.stringify(customMap));
    const markersQueryString = markerStrings.join("&");

    return `https://maps.googleapis.com/maps/api/staticmap?center=${markers[0].lat},${markers[0].long}&zoom=13&size=400x200&maptype=roadmap&style=${styles}&${markersQueryString}&key=${API_KEY}`;
};


export const findAddress = async ({lat, long}) => {
    try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${API_KEY}`
        );
  
        if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        const formattedAdress = address.replace(/[0-9]/g, '')
        return formattedAdress
}
    }catch(err){
        console.log(err)
    }
    
}