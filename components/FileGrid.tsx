import { Box, Flex, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import File from "./File";
import { actions } from "../data/store";
import { File as FileType } from "../types/types";

type Props = { files: FileType[]; loading: boolean };
export default function FileGrid({ files, loading }: Props) {
  const [maxIndex, setMaxIndex] = useState(10);
  const dispatch = useDispatch();

  function loadMoreFiles() {
    setMaxIndex(maxIndex + 10);
  }

  useEffect(() => {
    if (files.length === 0) {
      loadMoreFiles();
    }
  }, [files.length]);

  return (
    <SimpleGrid spacing={10} minChildWidth="200px" w="full">
      {files.slice(0, maxIndex).map((file, i) => {
        function onClick() {
          dispatch(actions.setActiveFile(file));
        }

        return <File file={file} onClick={onClick} key={i} />;
      })}
      {loading &&
        Array(files.length === 0 ? 5 : 20)
          .fill({})
          .map((_, i) => (
            <Skeleton key={i}>
              <Box h={48} w={48} />
            </Skeleton>
          ))}
      {maxIndex < files.length && (
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
