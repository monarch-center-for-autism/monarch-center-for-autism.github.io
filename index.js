import { Provider } from "react-redux";
import { store } from "./store";
import App from "./app";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
