import React from "react";
import { Heading, Box } from "@chakra-ui/react";
import { useSelector } from "../store";
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
      {files.length > 0 && (
        <Box mb={8}>
          <FileGrid
            files={files}
            loading={loading}
            queue={queue}
            folderId={id}
            isSubcategory={false}
          />
        </Box>
      )}
      {subcategories.map((s, i) => (
        <Box mb={8} key={i}>
          <Heading mb={4}>{s.name}</Heading>
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
