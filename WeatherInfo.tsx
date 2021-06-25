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

// FIX-ME ***********************************
// function isValidWeatherResponse(response : unknown) : response is {shortForecast : string, temperature : number} {
//   if (typeof response === "object") { if("properties" in response) }

// }

function parseWeatherApiResponse(json: Record<string, unknown>): {
  shortForecast: string;
  temperature: number;
} {
  const shortForecast = json?.properties?.periods[0].shortForecast;
  const temperature = json.properties.periods[0].temperature;
  return { shortForecast, temperature };
}
// FIX-ME ***********************************

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
