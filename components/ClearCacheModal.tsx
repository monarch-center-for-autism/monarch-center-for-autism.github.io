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
import { actions, useSelector } from "../data/store";

export default function ClearCacheModal() {
  const isOpen = useSelector((state) => state.modals.clearCacheModalVisible);
  const dispatch = useDispatch();

  function handleOnClose() {
    dispatch(actions.hideClearCacheModal());
  }

  function handleClearCache() {
    localStorage.setItem("structureInvalidationTime", Date.now().toString());
    localStorage.setItem("fileInvalidationTime", Date.now().toString());
    window.location.reload();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Refresh Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody fontWeight={300}>
          To save on loading time, the site remembers all of the pages and files
          after you see them for the first time. It checks for new files
          approximately every week and new files every day. However, if new
          content was added, and you want to see it now, you'll have to tell the
          site to look for it.
        </ModalBody>

        <ModalFooter>
          <Button mr={3} colorScheme="red" onClick={handleOnClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleClearCache}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
