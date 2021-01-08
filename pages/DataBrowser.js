import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import File from "../components/File";
import FileSpotlight from "../components/FileSpotlight";

export default function DataBrowser() {
  const { page } = useParams();
  const data = useSelector((state) => state.data);
  const searchResults = useSelector((state) => state.displayData);
  const loading = useSelector((state) => state.loading);

  const [activeFile, setActiveFile] = useState(null);

  function handleOnClose() {
    setActiveFile(null);
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
      {query && searchResults.length === 0 && (
        <div className="w-full py-8 text-center">
          <span className="text-2xl">
            Your search didn't return any results.
          </span>
        </div>
      )}
      {query && searchResults.length > 0 && (
        <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          {searchResults.map((result, i) => {
            function onClick() {
              setActiveFile(result);
            }

            return <File file={result} key={i} onClick={onClick} />;
          })}
        </div>
      )}
      {!query &&
        Object.entries(data).map(([category, files]) => (
          <div className="mb-8">
            <h2 className="text-2xl mb-4">{category}</h2>
            <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
              {files.map((file, i) => {
                function onClick() {
                  setActiveFile(file);
                }

                return <File file={file} key={i} onClick={onClick} />;
              })}
            </div>
          </div>
        ))}

      <Modal isOpen={activeFile} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FileSpotlight file={activeFile} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
