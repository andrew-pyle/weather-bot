import React from "react";
import ReactDOM from "react-dom";

interface Props {}
interface State {
  lat: null | number;
  long: null | number;
  geoError: null | string;
  geoLoading: boolean;
  turboMode: boolean;
}

export class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lat: null,
      long: null,
      geoError: null,
      geoLoading: false,
      turboMode: false,
    };
  }

  requestGeolocation = () => {
    this.setState({
      geoLoading: true,
    });
    fetchGeoCoords()
      .then((coords) => {
        this.setState({
          lat: coords.lat,
          long: coords.long,
          geoLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          geoError: err.message,
          geoLoading: false,
        });
      });
  };

  changeTurboMode = () => {
    console.log("yello");
    this.setState(function (prevState) {
      return { turboMode: !prevState.turboMode };
    });
  };

  // html
  render() {
    return (
      <RobotSays>
        <div className={this.state.turboMode ? "turbo" : null}>
          {this.state.geoError ? (
            <p>We had an Error 🐩: "{this.state.geoError}"</p>
          ) : null}
          {!this.state.lat || !this.state.long ? (
            this.state.geoLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p>
                  Weather Bot needs location access from the browser to do it's
                  job.
                </p>
                <button type="button" onClick={this.requestGeolocation}>
                  Use Device Location
                </button>
                <Turbo
                  turboMode={this.state.turboMode}
                  onToggle={this.changeTurboMode}
                ></Turbo>
              </div>
            )
          ) : (
            <div>
              <WeatherInfo lat={this.state.lat} long={this.state.long} />
            </div>
          )}
        </div>
      </RobotSays>
    );
  }
}

function Turbo(props) {
  return (
    <p>
      <label>
        <input
          type="checkbox"
          checked={props.turboMode}
          onChange={props.onToggle}
        ></input>
        Turbo Mode?
      </label>
    </p>
  );
}

function RobotSays(props) {
  return (
    <div className="robotResponse">
      <img src="robotTalking.gif" height="50" className="robotTalking"></img>
      {props.children}
    </div>
  );
}

export class WeatherInfo extends React.Component {
  constructor(props) {
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

/**
 * Helper Functions
 */

// In milliseconds
const FIFTEEN_MINTUES = 5 * 60 * 1000;
const FIVE_SECONDS = 5 * 1000;

export function fetchGeoCoords() {
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

export function determineOutfit(
  shortForecast: string,
  temperature: number
): string {
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

/**
 * Mount React App
 */
const reactRoot = document.getElementById("react-root");
if (reactRoot) {
  ReactDOM.render(<App />, reactRoot);
}
