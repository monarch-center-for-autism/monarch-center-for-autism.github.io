import {
  Box,
  Heading,
  SimpleGrid,
  CircularProgress,
  Skeleton,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import File from "../components/File";
import PageNotFound from "./PageNotFound";
import { fetchCategory, actions } from "../store";

const placeholders = Array(5).fill({ id: "placeholder" });

export default function DataBrowser() {
  const { page } = useParams();
  const allData = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const pageData = allData.find(
    ({ id, name }) =>
      new RegExp(id).test(page) || new RegExp(name, "i").test(page)
  );

  useEffect(() => {
    if (!pageData) return;

    pageData.categories.forEach(({ id, files }) => {
      if (!files) {
        dispatch(fetchCategory(id));
      }
    });
  }, [pageData]);

  if (allData.length === 0) {
    return <CircularProgress isIndeterminate size={32} py={16} mx="auto" />;
  }

  if (!pageData) {
    return <PageNotFound page={page} />;
  }

  return (
    <Box p={4} flex={1}>
      {pageData.categories.map(({ name, files }) => {
        const gridItems = [
          // If the array is empty, we insert placeholders that give Skeletons size
          ...(files?.length > 0 ? files : placeholders),
          // We want ~1 row of empty items to ensure none of the file panels gets stretched
          ...Array(5),
        ];

        return (
          <Box mb={32} key={name}>
            <Heading mb={4}>{name}</Heading>
            <SimpleGrid spacing={10} minChildWidth="250px">
              {gridItems.map((file, i) => {
                function onClick() {
                  dispatch(actions.setActiveFile(file));
                }

                return (
                  <Skeleton isLoaded={files?.length > 0} key={i}>
                    <File file={file} onClick={onClick} />
                  </Skeleton>
                );
              })}
            </SimpleGrid>
          </Box>
        );
      })}
    </Box>
  );
}
