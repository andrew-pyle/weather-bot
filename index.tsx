import React from "react";
import ReactDOM from "react-dom";
import { WeatherInfo } from "./WeatherInfo";

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
        <div className={this.state.turboMode ? "turbo" : undefined}>
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

function Turbo(props: { turboMode: boolean; onToggle: () => void }) {
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

function RobotSays(props: { children: JSX.Element }) {
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

export function fetchGeoCoords(): Promise<{ lat: number; long: number }> {
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

/**
 * Mount React App
 */

const reactRoot = document.getElementById("react-root");
if (reactRoot) {
  ReactDOM.render(<App />, reactRoot);
}
