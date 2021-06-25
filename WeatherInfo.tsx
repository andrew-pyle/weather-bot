import React from "react";

interface Props {
  lat: number;
  long: number;
}

interface State {
  weatherData: null | { shortForecast: string; temperature: number };
  weatherError: null | string;
}

export class WeatherInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      weatherData: null,
      weatherError: null,
    };
  }

  fetchWeather = (): void => {
    fetch(
      `https://api.weather.gov/points/${this.props.lat},${this.props.long}/forecast/`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else throw new Error("HTTP Error: " + res.status);
      })
      .then((json) => {
        const { shortForecast, temperature } = parseWeatherApiResponse(json);
        this.setState({
          weatherData: {
            shortForecast,
            temperature,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          weatherError: err.message,
        });
      });
  };

  componentDidMount() {
    this.fetchWeather();
  }

  render() {
    return (
      <div>
        {this.state.weatherError ? (
          <p>We had an Error 😱: {this.state.weatherError}</p>
        ) : (
          <p>
            {this.state.weatherData
              ? determineOutfit(
                  this.state.weatherData.shortForecast,
                  this.state.weatherData.temperature
                )
              : "Please wait..."}
          </p>
        )}
      </div>
    );
  }
}

// Helper Functions

/**
 * Empirically Determined
 * https://api.weather.gov/points/{latitude},{longitude}/forecast/
 */
interface NationalWeatherServiceApiResponse {
  properties: {
    periods: NationalWeatherServiceForecast[];
    // ...
  };
}
/**
 * Empirically Determined
 * https://api.weather.gov/points/{latitude},{longitude}/forecast/
 */
interface NationalWeatherServiceForecast {
  detailedForecast: string;
  endTime: string; // "2021-06-25T18:00:00-05:00"
  icon: string; // "https://api.weather.gov/icons/land/day/tsra_hi,20?size=medium"
  isDaytime: boolean;
  name: string; // "This Afternoon"
  number: number; // index (1-based)
  shortForecast: string; // "Slight Chance Showers And Thunderstorms"
  startTime: string; // "2021-06-25T14:00:00-05:00"
  temperature: number; // 92
  temperatureTrend: null; // ??
  temperatureUnit: string; // "F"
  windDirection: string; // "S"
  windSpeed: string; // "10 mph"
}
function parseWeatherApiResponse(json: NationalWeatherServiceApiResponse): {
  shortForecast: string;
  temperature: number;
} {
  const shortForecast = json.properties.periods[0].shortForecast;
  const temperature = json.properties.periods[0].temperature;
  return { shortForecast, temperature };
}

function determineOutfit(shortForecast: string, temperature: number): string {
  if (isRaining(shortForecast)) {
    if (temperature < 100) return "Better wear a jacket and bring an umbrella.";
    else return "Bring an umbrella.";
  } else {
    if (temperature < 100) return "It's sunny, but you better wear a jacket.";
    else return "It's sunny, and it feels lovely outside; wear some shorts.";
  }
}

function isRaining(shortForecast: string): boolean {
  const regex = /rain|storm|shower/i;
  return regex.test(shortForecast);
}
