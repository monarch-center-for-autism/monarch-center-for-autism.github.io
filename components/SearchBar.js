import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { actions } from "../store";

export default function SearchBar() {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");

  function handleOnChange(e) {
    console.log(e);
    setValue(e.target.value);
    dispatch(actions.search(e.target.value));
  }

  return (
    <div className="border-b border-white ml-4">
      <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
      <input
        className="bg-transparent pl-4"
        value={value}
        onChange={handleOnChange}
      />
    </div>
  );
}
