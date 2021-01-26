import PageBrowser from "./PageBrowser";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";
import useAuth from "../utils/useAuth";

export default function Router() {
  useAuth();

  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/:page/:category?">
        <PageBrowser />
      </Route>
    </Switch>
  );
}
