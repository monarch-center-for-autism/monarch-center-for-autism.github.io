import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as google from "../data/google-apis";
import { getUser, setGtmVariable } from "../data/google-apis";
import { actions, fetchStructure } from "../data/store";

export default function useAuth() {
  const dispatch = useDispatch();

  function handleIsSignedInChange(val) {
    if (val) {
      dispatch(fetchStructure());
      dispatch(actions.setUser(google.getUser()));
      setGtmVariable("user_id", getUser().email);
    } else {
      dispatch(actions.setUser(null));
    }
  }

  async function init() {
    await google.initGoogleClient();
    google.setOnAuthStatusChange(handleIsSignedInChange);

    if (google.isSignedIn()) {
      handleIsSignedInChange(true);
    } else {
      await google.signIn();
    }
  }

  useEffect(() => {
    init().then(/* do nothing */);
  }, []);
}
