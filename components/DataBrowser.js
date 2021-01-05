import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import File from "./File";
import FileSpotlight from "./FileSpotlight";
import Modal from "./Modal";

export default function DataBrowser() {
  const query = useSelector((state) => state.query);
  const data = useSelector((state) => state.data);
  const displayData = useSelector((state) => state.displayData);
  const loading = useSelector((state) => state.loading);

  const [activeFile, setActiveFile] = useState(null);
  const results = displayData.length > 0 ? displayData : data;

  function handleOnClose() {
    setActiveFile(null);
  }

  function openFilePreview(file) {
    setActiveFile(file);
  }

  if (loading) {
    return (
      <div className="flex-1 w-full py-8 text-center">
        <FontAwesomeIcon icon={faSync} spin={true} className="text-9xl" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4">
      {query && (
        <div className="w-full py-8 text-center">
          <span className="text-lg text-gray-700">
            Showing search results for "{query}"
          </span>
        </div>
      )}

      {query && displayData.length === 0 ? (
        <div className="w-full py-8 text-center">
          <span className="text-2xl">
            Your search didn't return any results.
          </span>
        </div>
      ) : (
        <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          {results.map((result, i) => {
            function onClick() {
              setActiveFile(result);
            }

            return <File file={result} key={i} onClick={onClick} />;
          })}
        </div>
      )}

      <Modal show={activeFile} onClose={handleOnClose}>
        <FileSpotlight file={activeFile} />
      </Modal>
    </div>
  );
}
