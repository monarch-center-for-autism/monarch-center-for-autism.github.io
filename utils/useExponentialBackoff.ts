import { useState } from "react";

export default function useExponentialBackoff(
  src: string
): [string, () => void] {
  const [url, setUrl] = useState(src + "&r=9");
  const [backoffAmount, setBackoffAmount] = useState(9);

  function onError() {
    function tryAgain() {
      setUrl(url.replace(`r=${backoffAmount}`, `r=${backoffAmount + 1}`));
      setBackoffAmount(backoffAmount + 1);
    }

    setTimeout(tryAgain, Math.pow(2, backoffAmount));
  }

  return [url, onError];
}
