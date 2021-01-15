import React, { useEffect } from "react";
import { Box, Heading, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { actions, fetchCategory } from "../store";
import { Category } from "../types/types";
import File from "./File";
import { groupBy, mapKeys, mapValues } from "lodash";

const placeholders = Array(5).fill({ id: "placeholder" });

type Props = { category: Category };
export default function CategoryBrowser({ category }: Props) {
  const dispatch = useDispatch();
  const { id, files, subcategories } = category;

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
    // If the array is empty, we insert placeholders that give Skeletons size
    ...(v?.length > 0 ? v : placeholders),
    // We want ~1 row of empty items to ensure none of the file panels gets stretched
    ...Array(5),
  ]);

  return (
    <Box mb={32} key={id}>
      {Object.entries(filesWithPaddedValues).map(([header, gridItems], i) => (
        <React.Fragment key={i}>
          {header !== "undefined" && <Heading mb={4}>{header}</Heading>}
          <SimpleGrid spacing={10} minChildWidth="250px">
            {gridItems.map((file, j) => {
              function onClick() {
                dispatch(actions.setActiveFile(file));
              }

              return (
                <Skeleton isLoaded={files?.length > 0} key={j}>
                  <File file={file} onClick={onClick} />
                </Skeleton>
              );
            })}
          </SimpleGrid>
        </React.Fragment>
      ))}
    </Box>
  );
}
