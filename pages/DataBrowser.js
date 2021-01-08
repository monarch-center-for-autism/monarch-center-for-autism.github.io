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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import File from "../components/File";
import FileSpotlight from "../components/FileSpotlight";
import PageNotFound from "./PageNotFound";
import { fetchCategory } from "../store";

export default function DataBrowser() {
  const { page } = useParams();
  const allData = useSelector((state) => state.data);
  const [activeFile, setActiveFile] = useState(null);
  const dispatch = useDispatch();

  const pageData = allData.find(
    ({ id, name }) =>
      new RegExp(id).test(page) || new RegExp(name, "i").test(page)
  );

  useEffect(() => {
    if (!pageData) return;

    pageData.categories.forEach(({ id, name, files }) => {
      if (!files) {
        dispatch(fetchCategory(id));
      }
    });
  }, [pageData]);

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
          <Box mb={8} key={name}>
            <Heading mb={4}>{name}</Heading>
            <SimpleGrid spacing={10} columns={3}>
              {(files ?? []).map((file) => {
                function onClick() {
                  setActiveFile(file);
                }

                return <File file={file} key={file.id} onClick={onClick} />;
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
