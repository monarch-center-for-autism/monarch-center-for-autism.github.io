import { Box, Flex, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
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
      {files.map((file, i) => {
        function onClick() {
          dispatch(actions.setActiveFile(file));
        }

        return <File file={file} onClick={onClick} key={i} />;
      })}
      {loading &&
        Array(files.length === 0 ? 5 : 20).map((_, j) => (
          <Skeleton key={j}>
            <Box h={60} w={60} />
          </Skeleton>
        ))}
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
