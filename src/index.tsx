import React from "https://cdn.skypack.dev/react@^17";
import ReactDOM from "https://cdn.skypack.dev/react-dom@^17";
import { App } from "./App.js";
/**
 * Mount React App
 */
const reactRoot = document.getElementById("react-root");
if (reactRoot) {
  ReactDOM.render(<App />, reactRoot);
}
