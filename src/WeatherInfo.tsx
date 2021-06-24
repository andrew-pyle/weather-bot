import React from "https://cdn.skypack.dev/react@^17";
import { parseWeatherApiResponse, determineOutfit } from "./utils.js";

interface Props {
  lat: number;
  long: number;
}
interface State {
  weatherData: null | {
    shortForecast: string;
    temperature: number;
  };
  weatherError: string | null;
}

export class WeatherInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      weatherData: null,
      weatherError: null,
    };
  }

  fetchWeather = () => {
    fetch(
      `https://api.weather.gov/points/${this.props.lat},${this.props.long}/forecast/`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
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
          weatherError: err,
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
        ) : null}
        <p>
          {this.state.weatherData
            ? determineOutfit(
                this.state.weatherData.shortForecast,
                this.state.weatherData.temperature
              )
            : "Please wait..."}
        </p>
      </div>
    );
  }
}
