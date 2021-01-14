import {
  Box,
  Heading,
  SimpleGrid,
  CircularProgress,
  Skeleton,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import File from "../components/File";
import PageNotFound from "./PageNotFound";
import { fetchCategory, actions, useSelector } from "../store";
import { Folder } from "../types/types";

const placeholders = Array(5).fill({ id: "placeholder" });

function matches({ id, name }: Folder, q: string): boolean {
  return new RegExp(id).test(q) || new RegExp(name, "i").test(q);
}

export default function DataBrowser() {
  const { page } = useParams();
  const dispatch = useDispatch();

  const pages = useSelector((state) => state.pages);
  const { id: pageId } = pages.find((p) => matches(p, page)) ?? {};

  const categories = useSelector((state) => state.categories).filter(
    (c) => c.pageId === pageId
  );

  useEffect(() => {
    categories
      .filter((c) => c.pageId === pageId && c.files.length === 0)
      .forEach(({ id }) => dispatch(fetchCategory(id)));
  }, [categories.length]);

  if (pages.length === 0) {
    return <CircularProgress isIndeterminate size={32} py={16} mx="auto" />;
  }

  if (!pageId) {
    return <PageNotFound page={page} />;
  }

  return (
    <Box p={4} flex={1}>
      {categories.map(({ name, files }) => {
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
