import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  Progress,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { actions, useSelector, fetchCategory } from "../data/store";
import sleep from "../utils/sleep";

export default function DownloadAllFilesModal() {
  const [isFetching, setIsFetching] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [progress, setProgress] = useState(0);
  const isOpen = useSelector(
    (state) => state.modals.downloadAllFilesModalVisible
  );
  const categories = useSelector((state) => state.categories);
  const subcategories = useSelector((state) => state.subcategories);
  const dispatch = useDispatch();

  function handleOnClose() {
    if (isFetching) return;

    dispatch(actions.hideDownloadAllFilesModal());
  }

  async function handleDownloadAllFiles() {
    setIsFetching(true);

    const categoriesToFetch = categories.filter((c) => c.queue.length > 0);
    const subcategoriesToFetch = subcategories.filter(
      (s) => s.queue.length > 0
    );
    const total = categoriesToFetch.length + subcategoriesToFetch.length;
    let current = 0;

    for (let c of categoriesToFetch) {
      let action,
        timesFetched = 0;
      do {
        setCurrentCategory(
          `[${current}/${total}] Fetching ${c.name} - ${++timesFetched} / ?`
        );
        action = await dispatch(
          fetchCategory({ category: c.id, searchSubfolders: false })
        );
        await sleep(50);
      } while (action?.payload?.queue?.length > 0);
      setProgress((++current * 100) / total);
    }

    for (let s of subcategoriesToFetch) {
      let action,
        timesFetched = 0;
      do {
        setCurrentCategory(
          `[${current}/${total}] Fetching ${s.name} - ${++timesFetched} / ?`
        );
        action = await dispatch(
          fetchCategory({ category: s.id, searchSubfolders: true })
        );
        await sleep(50);
      } while (action?.payload?.queue?.length > 0);
      setProgress((++current * 100) / total);
    }

    setIsFetching(false);
    dispatch(actions.hideDownloadAllFilesModal());
  }

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Prepare to Search All Resources</ModalHeader>
        {!isFetching && <ModalCloseButton />}
        <ModalBody fontWeight={300}>
          To search all resources, some data has to be downloaded about the
          files you haven't seen yet.{" "}
          <strong>
            This process could take a couple minutes, and it can't be cancelled.
          </strong>
          <br />
          <br />
          {isFetching && <Progress hasStripe isAnimated value={progress} />}
          {currentCategory}
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            colorScheme="red"
            onClick={handleOnClose}
            disabled={isFetching}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleDownloadAllFiles}
            isLoading={isFetching}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
