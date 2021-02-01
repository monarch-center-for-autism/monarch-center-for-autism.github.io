import { Box, Flex, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Fuse from "fuse.js";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import File from "./File";
import { actions } from "../data/store";
import { File as FileType } from "../types/types";
import FuseResult = Fuse.FuseResult;

type NormalFiles = { type: "normal"; files: FileType[] };
type SearchFiles = { type: "search"; files: FuseResult<FileType>[] };
type Props = { payload: NormalFiles | SearchFiles; loading: boolean };
export default function FileGrid({ payload, loading }: Props) {
  const [maxIndex, setMaxIndex] = useState(10);
  const dispatch = useDispatch();

  function loadMoreFiles() {
    setMaxIndex(maxIndex + 10);
  }

  let files;
  switch (payload.type) {
    case "search":
      files = payload.files.slice(0, maxIndex).map((file, i) => {
        function onClick() {
          dispatch(actions.setActiveFile(file.item));
        }

        return (
          <File
            file={file.item}
            matches={file.matches}
            onClick={onClick}
            key={i}
          />
        );
      });
      break;
    case "normal":
      files = payload.files.slice(0, maxIndex).map((file, i) => {
        function onClick() {
          dispatch(actions.setActiveFile(file));
        }

        return <File file={file} onClick={onClick} key={i} />;
      });
      break;
  }

  return (
    <SimpleGrid spacing={10} minChildWidth="200px" w="full">
      {files}
      {loading &&
        Array(10)
          .fill({})
          .map((_, i) => (
            <Skeleton key={i}>
              <Box h={48} w={48} />
            </Skeleton>
          ))}
      {maxIndex < payload.files.length && (
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
          h={48}
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            style={{ width: "3rem", height: "3rem" }}
          />
          <Text mt={4}>See More Files</Text>
        </Flex>
      )}
      {/* Keeps the see more files button from stretching */}
      {Array(5)
        .fill({})
        .map((_, i) => (
          <div key={i} />
        ))}
    </SimpleGrid>
  );
}
