import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchData } from "../store";

export default function LogInButton() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();

  async function logIn() {
    const auth = await authenticate({
      keyfilePath: path.join(__dirname, "../oauth2.keys.json"),
      scopes: "https://www.googleapis.com/auth/drive.readonly",
    });
    google.options({ auth });
    dispatch(fetchData());
    setLoggedIn(true);
  }

  if (isLoggedIn) return null;

  return (
    <button onClick={logIn}>
      <FontAwesomeIcon icon={faUser} className="mr-2" />
      Log In
    </button>
  );
}
