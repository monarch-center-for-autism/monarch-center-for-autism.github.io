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
import { actions, useSelector } from "../data/store";
import FileSpotlight from "./FileSpotlight";

export default function FileModal() {
  const activeFile = useSelector((state) => state.modals.activeFile);
  const dispatch = useDispatch();

  function handleOnClose() {
    dispatch(actions.setActiveFile(null));
  }

  return (
    <Modal isOpen={!!activeFile} onClose={handleOnClose} size="full">
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
