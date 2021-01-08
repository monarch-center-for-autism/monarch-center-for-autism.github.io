import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { store } from "./store";
import Fonts from "./structure/Fonts";
import Header from "./structure/Header";
import Sidebar from "./structure/SideBar";

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
        <Flex direction="column" minH="100vh">
          <Header />
          <Flex flex={1}>
            <Sidebar />
            <Router />
          </Flex>
        </Flex>
      </BrowserRouter>
    </Provider>
  </ChakraProvider>,
  document.getElementById("app")
);
