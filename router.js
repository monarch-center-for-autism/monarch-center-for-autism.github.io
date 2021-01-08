import DataBrowser from "./pages/DataBrowser";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Search from "./pages/Search";
import useAuth from "./utils/useAuth";

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
      <Route path="/:page">
        <DataBrowser />
      </Route>
    </Switch>
  );
}
