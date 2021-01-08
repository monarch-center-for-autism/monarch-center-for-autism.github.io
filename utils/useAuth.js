import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchStructure } from "../store";
import {
  initGoogleClient,
  isSignedIn,
  setOnAuthStatusChange,
  signIn,
} from "./google-apis";

export default function useAuth() {
  const dispatch = useDispatch();

  function handleIsSignedInChange(val) {
    if (val) dispatch(fetchStructure());
  }

  async function init() {
    await initGoogleClient();
    setOnAuthStatusChange(handleIsSignedInChange);

    if (isSignedIn()) {
      handleIsSignedInChange(true);
    } else {
      await signIn();
    }
  }

  useEffect(() => {
    init().then(/* do nothing */);
  }, []);
}
