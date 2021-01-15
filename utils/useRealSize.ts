import React, { useRef, useState, useEffect } from "react";
import { debounce } from "lodash";

export default function useRealSize(): [
  number,
  number,
  React.LegacyRef<HTMLImageElement>
] {
  const ref = useRef<HTMLImageElement>(null);
  const [[width, height], setSize] = useState([0, 0]);

  useEffect(
    debounce(() => {
      setSize([ref.current?.offsetHeight, ref.current?.offsetWidth]);
    }),
    [ref.current?.offsetHeight, ref.current?.offsetWidth]
  );

  return [width, height, ref];
}
