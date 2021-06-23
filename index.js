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
    };
  }

  requestGeolocation = () => {
    fetchGeoCoords()
      .then((coords) => {
        this.setState({
          lat: coords.lat,
          long: coords.long,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          geoError: err,
        });
      });
  };

  // html
  render() {
    if (!this.state.lat || !this.state.long) {
      return (
        <div>
          <p>
            Weather Bot needs location access from the browser to do it's job.
          </p>
          <button type="button" onClick={this.requestGeolocation}>
            Allow Location Access
          </button>
        </div>
      );
    }
    return (
      <div>
        <WeatherInfo lat={this.state.lat} long={this.state.long} />
      </div>
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
          <p>We had an Error 😱: "{this.state.weatherError}"</p>
        ) : null}
        <pre>
          <code>{JSON.stringify(this.state.weatherData, null, 2)}</code>
        </pre>
      </div>
    );
  }
}

/**
 * Helper Functions
 */

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
        console.error(err);
        reject(err);
      }
    );
  });
}

function parseWeatherApiResponse(json) {
  const shortForecast = json.properties.periods[0].shortForecast;
  const temperature = json.properties.periods[0].temperature;
  return { shortForecast, temperature };
}

/**
 * Mount React App
 */
const reactRoot = document.getElementById("react-root");
if (reactRoot) {
  ReactDOM.render(<App />, reactRoot);
}
