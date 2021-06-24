import React from "react";
import ReactDOM from "react-dom";
import { App } from "./src/App";

/**
 * Mount React App
 */
const reactRoot = document.getElementById("react-root");
if (reactRoot) {
  ReactDOM.render(<App />, reactRoot);
}
