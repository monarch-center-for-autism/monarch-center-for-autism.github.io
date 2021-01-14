import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import { store } from "./store";
import Fonts from "./structure/Fonts";

const theme = extendTheme({
  fonts: {
    heading: "Patua One",
    body: "Rubik",
  },
});

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <Fonts />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ChakraProvider>,
  document.getElementById("app")
);
