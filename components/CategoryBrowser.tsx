import React from "react";
import { Heading, Box } from "@chakra-ui/react";
import { useSelector } from "../data/store";
import { Category } from "../types/types";
import FileGrid from "./FileGrid";

type Props = { category: Category };
export default function CategoryBrowser({ category }: Props) {
  const { id, files, loading, queue } = category;
  const subcategories = useSelector((state) => state.subcategories).filter(
    ({ categoryId }) => categoryId === id
  );

  return (
    <>
      <Box mb={files.length > 0 ? 8 : 0}>
        <FileGrid
          files={files}
          loading={loading}
          queue={queue}
          folderId={id}
          isSubcategory={false}
        />
      </Box>
      {subcategories.map((s, i) => (
        <Box mb={8} key={i}>
          <Heading mb={4} id={s.id}>
            {s.name}
          </Heading>
          <FileGrid
            folderId={s.id}
            queue={s.queue}
            files={s.files}
            loading={s.loading}
          />
        </Box>
      ))}
    </>
  );
}
