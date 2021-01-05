import React from "react";
import { useSelector } from "react-redux";

export default function DataBrowser() {
  const query = useSelector((state) => state.query);
  const data = useSelector((state) => state.data);
  const displayData = useSelector((state) => state.displayData);

  const results = displayData.length > 0 ? displayData : data;

  return (
    <div className="flex-1 p-4">
      {query && <div>Query: {query}</div>}
      {query && displayData.length === 0 ? (
        <div>No results!</div>
      ) : (
        <div>
          {results.map((result, i) => (
            <div key={i}>{result}</div>
          ))}
        </div>
      )}
    </div>
  );
}
