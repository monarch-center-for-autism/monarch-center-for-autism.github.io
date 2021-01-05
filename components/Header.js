import React from "react";
import SearchBar from "./SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { actions } from "../store";

export default function Header() {
  return (
    <div className="w-full p-4 bg-blue-800 text-white text-white">
      <h1 className="inline-block">Drive Resource Viewer</h1>
      <div className="float-right flex">
        <FontAwesomeIcon
          icon={faSync}
          className="w-6 h-6"
          onClick={actions.fetchData}
        />
        <SearchBar />
      </div>
    </div>
  );
}
