/**
 * Helper Functions
 */

// In milliseconds
const FIFTEEN_MINTUES = 5 * 60 * 1000;
const FIVE_SECONDS = 5 * 1000;

interface Coordinates {
  lat: number;
  long: number;
}

export function fetchGeoCoords(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (response) => {
        const lat = response.coords.latitude;
        const long = response.coords.longitude;
        console.log(`Latitude found: ${lat}`);
        console.log(`Longitude found: ${long}`);
        resolve({ lat, long });
      },
      (err) => {
        reject(err);
      },
      {
        maximumAge: FIFTEEN_MINTUES,
        timeout: FIVE_SECONDS,
      }
    );
  });
}

export function parseWeatherApiResponse(json) {
  const shortForecast = json.properties.periods[0].shortForecast;
  const temperature = json.properties.periods[0].temperature;
  return { shortForecast, temperature };
}

export function determineOutfit(shortForecast, temperature) {
  if (isRaining(shortForecast)) {
    if (temperature < 100) return "Better wear a jacket and bring an umbrella.";
    else return "Bring an umbrella.";
  } else {
    if (temperature < 100) return "It's sunny, but you better wear a jacket.";
    else return "It's sunny, and it feels lovely outside; wear some shorts.";
  }
}

function isRaining(shortForecast) {
  const regex = /rain|storm|shower/i;
  return regex.test(shortForecast);
}
