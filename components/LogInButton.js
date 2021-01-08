import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { initGoogleClient } from "../utils/google-apis";
import { fetchStructure } from "../store";
import { Button } from "@chakra-ui/react";

export default function LogInButton() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function init() {
      await initGoogleClient();
      window.gapi.auth2
        .getAuthInstance()
        .isSignedIn.listen(handleIsSignedInChange);
      handleIsSignedInChange(
        window.gapi.auth2.getAuthInstance().isSignedIn.get()
      );
    }

    init().then(/* do nothing */);
  });

  function handleIsSignedInChange(val) {
    setLoggedIn(val);
    if (val) dispatch(fetchStructure());
  }

  async function logIn() {
    await window.gapi.auth2.getAuthInstance().signIn();
  }

  if (isLoggedIn) return null;

  return (
    <>
      <Button onClick={logIn} colorScheme="blue">
        <FontAwesomeIcon icon={faUser} style={{ marginRight: "0.5rem" }} />
        Log In
      </Button>
    </>
  );
}
