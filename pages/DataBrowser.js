import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Heading,
  SimpleGrid,
  CircularProgress,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import File from "../components/File";
import FileSpotlight from "../components/FileSpotlight";
import PageNotFound from "./PageNotFound";

export default function DataBrowser() {
  const { page } = useParams();
  const allData = useSelector((state) => state.data);
  const [activeFile, setActiveFile] = useState(null);

  const pageData = allData.find(
    ({ id, name }) =>
      new RegExp(id).test(page) || new RegExp(name, "i").test(page)
  );

  function handleOnClose() {
    setActiveFile(null);
  }

  if (allData.length === 0) {
    return <CircularProgress isIndeterminate size={32} py={16} mx="auto" />;
  }

  if (!pageData) {
    return <PageNotFound page={page} />;
  }

  return (
    <>
      <Box p={4}>
        {pageData.categories.map(({ name, files }) => (
          <Box mb={8}>
            <Heading mb={4}>{name}</Heading>
            <SimpleGrid spacing={10} columns={3}>
              {files.map((file, i) => {
                function onClick() {
                  setActiveFile(file);
                }

                return <File file={file} key={i} onClick={onClick} />;
              })}
            </SimpleGrid>
          </Box>
        ))}
      </Box>

      <Modal isOpen={activeFile} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{activeFile?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {activeFile && <FileSpotlight file={activeFile} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
