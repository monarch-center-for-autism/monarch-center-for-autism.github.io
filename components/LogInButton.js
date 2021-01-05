import { faSync, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchData } from "../store";

const CLIENT_ID =
  "213210055298-9bf1j4200q0mufvv10g6s9e9960ocsu2.apps.googleusercontent.com";
const API_KEY = "AIzaSyC7rpHcULLoKDdtPX5u4vV1bZhv58cSzgQ";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

export default function LogInButton() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    window.gapi.load("client:auth2", initClient);
  }, []);

  async function initClient() {
    await window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });

    window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

    updateSignInStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  function updateSignInStatus(isSignedIn) {
    setLoggedIn(isSignedIn);
    if (isSignedIn) {
      handleFetchData();
    }
  }

  function handleFetchData() {
    dispatch(fetchData());
  }

  function logIn() {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  return isLoggedIn ? (
    <button>
      <FontAwesomeIcon
        icon={faSync}
        className="mr-2"
        onClick={handleFetchData}
      />
      Refresh Data
    </button>
  ) : (
    <button onClick={logIn}>
      <FontAwesomeIcon
        icon={faUser}
        className="mr-2"
        onClick={handleFetchData}
      />
      Log In
    </button>
  );
}
