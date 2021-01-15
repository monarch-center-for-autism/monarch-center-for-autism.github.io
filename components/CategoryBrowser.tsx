import React, { useEffect } from "react";
import {
  Heading,
  SimpleGrid,
  Skeleton,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { actions, fetchCategory } from "../store";
import { Category } from "../types/types";
import File from "./File";
import { groupBy, mapKeys, mapValues } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

type Props = { category: Category };
export default function CategoryBrowser({ category }: Props) {
  const dispatch = useDispatch();
  const { id, files, subcategories, loading, folders: queue } = category;

  function loadMoreFiles() {
    dispatch(fetchCategory(id));
  }

  useEffect(() => {
    if (files.length === 0) {
      dispatch(fetchCategory(id));
    }
  }, [files.length]);

  const groupedFiles = groupBy(files, "parents[0]");
  const filesWithNameKeys = mapKeys(
    groupedFiles,
    (_, k) => subcategories.find((s) => s.id === k)?.name
  );

  const filesWithPaddedValues = mapValues(filesWithNameKeys, (v) => [
    ...v,
    // If the array is empty, we insert placeholders that give Skeletons size
    // Either way, we want ~1 row of empty items to ensure none of the file panels
    // gets stretched
    ...Array(5).fill(loading ? { id: "placeholder" } : undefined),
  ]);

  return (
    <>
      {Object.entries(filesWithPaddedValues).map(([header, gridItems], i) => (
        <React.Fragment key={i}>
          {header !== "undefined" && <Heading mb={4}>{header}</Heading>}
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
        </React.Fragment>
      ))}
    </>
  );
}
