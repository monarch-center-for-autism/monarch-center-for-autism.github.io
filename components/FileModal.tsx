import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import FileSpotlight from "./FileSpotlight";
import { actions, useSelector } from "../store";

export default function FileModal() {
  const activeFile = useSelector((state) => state.activeFile);
  const dispatch = useDispatch();

  function handleOnClose() {
    dispatch(actions.setActiveFile(null));
  }

  return (
    <Modal isOpen={activeFile} onClose={handleOnClose} size="full">
      <ModalOverlay />
      <ModalContent w="80%" h="80%">
        <ModalHeader>{activeFile?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {activeFile && <FileSpotlight file={activeFile} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
