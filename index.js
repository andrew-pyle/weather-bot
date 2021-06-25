/**
 * Globals:
 * - React
 * - ReactDOM
 */

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: "",
      long: "",
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
              </div>
            )
          ) : (
            <div>
              <WeatherInfo lat={this.state.lat} long={this.state.long} />
            </div>
          )}
          <Turbo
            turboMode={this.state.turboMode}
            onToggle={this.changeTurboMode}
          ></Turbo>
        </div>
      </RobotSays>
    );
  }
}

class WeatherInfo extends React.Component {
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

/**
 * Helper Functions
 */

// In milliseconds
const FIFTEEN_MINTUES = 5 * 60 * 1000;
const FIVE_SECONDS = 5 * 1000;

function fetchGeoCoords() {
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

function parseWeatherApiResponse(json) {
  const shortForecast = json.properties.periods[0].shortForecast;
  const temperature = json.properties.periods[0].temperature;
  return { shortForecast, temperature };
}

function determineOutfit(shortForecast, temperature) {
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

/**
 * Mount React App
 */
const reactRoot = document.getElementById("react-root");
if (reactRoot) {
  ReactDOM.render(<App />, reactRoot);
}
