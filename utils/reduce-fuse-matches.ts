import { last } from "lodash";
import Fuse from "fuse.js";
import React from "react";

type FuseResultMatch = Fuse.FuseResultMatch;

type Match = { text: string; as?: React.ElementType };
export default function reduceFuseMatches(match: FuseResultMatch): Match[] {
  const original = match.value;
  const result = [];

  match.indices.forEach(([start, end], i) => {
    if (start > 0) {
      const lastEnd = i === 0 ? 0 : match.indices[i - 1][1];
      result.push({ text: original.slice(lastEnd, start) });
    }

    result.push({ text: original.slice(start, end + 1), as: "mark" });
  });

  const [, endOfLastMatch] = last(match.indices);
  result.push({ text: original.slice(endOfLastMatch + 1) });

  return result;
}
