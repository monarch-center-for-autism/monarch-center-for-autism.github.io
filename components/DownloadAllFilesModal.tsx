import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { actions, useSelector } from "../store";

export default function DownloadAllFilesModal() {
  const isOpen = useSelector(
    (state) => state.modals.downloadAllFilesModalVisible
  );
  const dispatch = useDispatch();

  function handleOnClose() {
    dispatch(actions.hideDownloadAllFilesModal());
  }

  function handleDownloadAllFiles() {}

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Prepare to Search All Files</ModalHeader>
        <ModalCloseButton />
        <ModalBody fontWeight={300}>
          To search all Monarch resources, some data has to be downloaded about
          the files you haven't seen yet. This process could take a couple
          minutes, and it can't be cancelled.
        </ModalBody>

        <ModalFooter>
          <Button mr={3} colorScheme="red" onClick={handleOnClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleDownloadAllFiles}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
