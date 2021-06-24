import React from "react";
import { WeatherInfo } from "./WeatherInfo";
import { fetchGeoCoords } from "./utils";

interface State {
  lat: null | number;
  long: null | number;
  geoError: null | string;
  geoLoading: boolean;
  turboMode: boolean;
}

export class App extends React.Component<{}, State> {
  constructor(props: {}) {
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
