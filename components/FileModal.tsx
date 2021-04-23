import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { actions, useSelector } from "../data/store";
import FileSpotlight from "./FileSpotlight";

export default function FileModal() {
  const [isFocusTrapped, setIsFocusTrapped] = useState(true);
  const activeFile = useSelector((state) => state.modals.activeFile);
  const dispatch = useDispatch();

  function handleOnClose() {
    dispatch(actions.setActiveFile(null));
  }

  function untrapFocus() {
    setIsFocusTrapped(false);
  }

  function retrapFocus() {
    setIsFocusTrapped(true);
  }

  return (
    <Modal
      isOpen={!!activeFile}
      onClose={handleOnClose}
      size="4xl"
      trapFocus={isFocusTrapped}
    >
      <ModalOverlay />
      <ModalContent w="80%" h="80%">
        <ModalHeader>{activeFile?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {activeFile && (
            <FileSpotlight
              file={activeFile}
              untrapFocus={untrapFocus}
              retrapFocus={retrapFocus}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
