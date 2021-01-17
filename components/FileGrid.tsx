import { Flex, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import React, { useEffect } from "react";
import File from "./File";
import { actions, fetchCategory } from "../store";
import { File as FileType, QueueFolder } from "../types/types";

type Props = {
  files: FileType[];
  loading: boolean;
  folderId: string;
  queue: QueueFolder[];
  isSubcategory?: boolean;
};
export default function FileGrid({
  files,
  loading,
  folderId,
  queue,
  isSubcategory = true,
}: Props) {
  const dispatch = useDispatch();
  const gridItems = [
    ...files,
    // If the array is empty, we insert placeholders that give Skeletons size
    // Either way, we want ~1 row of empty items to ensure none of the file panels
    // gets stretched
    ...Array(5).fill(loading ? { id: "placeholder" } : undefined),
  ];

  function loadMoreFiles() {
    dispatch(
      fetchCategory({ category: folderId, searchSubfolders: isSubcategory })
    );
  }

  useEffect(() => {
    if (files.length === 0) {
      loadMoreFiles();
    }
  }, [files.length]);

  return (
    <SimpleGrid spacing={10} minChildWidth="250px">
      {gridItems.map((file, j) => {
        function onClick() {
          dispatch(actions.setActiveFile(file));
        }

        return (
          <Skeleton isLoaded={!loading} key={j}>
            <File file={file} onClick={onClick} />
          </Skeleton>
        );
      })}
      {queue.length > 0 && (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          background="gray.200"
          borderRadius="lg"
          shadow="md"
          _hover={{
            shadow: "xl",
          }}
          transition="ease-in-out 0.2s"
          cursor="pointer"
          borderWidth="1px"
          onClick={loadMoreFiles}
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            style={{ width: "3rem", height: "3rem" }}
          />
          <Text mt={4}>See More Files</Text>
        </Flex>
      )}
    </SimpleGrid>
  );
}
