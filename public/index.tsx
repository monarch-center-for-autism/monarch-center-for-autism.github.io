import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import TagManager from "react-gtm-module";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../data/store";
import App from "../structure/app";
import Fonts from "../structure/Fonts";

const theme = extendTheme({
  fonts: {
    heading: "Patua One",
    body: "Rubik",
  },
});

TagManager.initialize({ gtmId: process.env.GTM_ID });

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
