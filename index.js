import { Provider } from "react-redux";
import DataBrowser from "./pages/DataBrowser";
import Fonts from "./components/Fonts";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { store } from "./store";
import App from "./app";
import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const theme = extendTheme({
  fonts: {
    heading: "Open Sans",
    body: "Raleway",
  },
});

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <Fonts />
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/:page">
            <DataBrowser />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </Provider>
  </ChakraProvider>,
  document.getElementById("app")
);
