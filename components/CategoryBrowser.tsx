import React from "react";
import { Heading } from "@chakra-ui/react";
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
      <FileGrid
        files={files}
        loading={loading}
        queue={queue}
        folderId={id}
        isSubcategory={false}
      />
      {subcategories.map((s, i) => (
        <React.Fragment key={i}>
          <Heading>{s.name}</Heading>
          <FileGrid
            folderId={s.id}
            queue={s.queue}
            files={s.files}
            loading={s.loading}
          />
        </React.Fragment>
      ))}
    </>
  );
}
