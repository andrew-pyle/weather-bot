/**
 * Globals:
 * - React
 * - ReactDOM
 */

function App({}) {
  return <p>React ⚛️</p>;
}

const reactRoot = document.getElementById("react-root");
if (reactRoot) {
  ReactDOM.render(<App />, reactRoot);
}
