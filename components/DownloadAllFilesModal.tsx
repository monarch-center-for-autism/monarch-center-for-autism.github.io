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
import CategoryState from "../types/category-states";

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

    const categoriesToFetch = categories.filter(
      (c) => c.state === CategoryState.INIT
    );
    const subcategoriesToFetch = subcategories.filter(
      (s) => s.state === CategoryState.INIT
    );
    const total = categoriesToFetch.length + subcategoriesToFetch.length;
    let current = 0;

    for (let category of categoriesToFetch) {
      let action;
      do {
        setCurrentCategory(`[${current}/${total}] Fetching ${category.name}`);
        action = await dispatch(
          fetchCategory({ category, isSubcategory: false })
        );
      } while (action?.payload?.queue?.length > 0);
      setProgress((++current * 100) / total);
    }

    for (let category of subcategoriesToFetch) {
      let action;
      do {
        setCurrentCategory(`[${current}/${total}] Fetching ${category.name}`);
        action = await dispatch(
          fetchCategory({ category, isSubcategory: true })
        );
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
        <ModalBody fontWeight="300">
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
