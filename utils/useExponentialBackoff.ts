import { useState } from "react";

export default function useExponentialBackoff(
  src: string
): [string, () => void] {
  const [url, setUrl] = useState(src + "?r=0");
  const [backoffAmount, setBackoffAmount] = useState(0);

  function onError() {
    function tryAgain() {
      setUrl(url.replace(`r=${backoffAmount}`, `r=${backoffAmount + 1}`));
      setBackoffAmount(backoffAmount + 1);
    }

    setTimeout(tryAgain, Math.random() * Math.pow(2, backoffAmount));
  }

  return [url, onError];
}
