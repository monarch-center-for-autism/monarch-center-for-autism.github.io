import { Box, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCategory, useSelector } from "../data/store";
import CategoryState from "../types/category-states";
import { Category } from "../types/types";
import FileGrid from "./FileGrid";

type Props = { category: Category };
export default function CategoryBrowser({ category }: Props) {
  const dispatch = useDispatch();
  const { id, files, state } = category;
  const subcategories = useSelector((state) => state.subcategories).filter(
    ({ categoryId }) => categoryId === id
  );

  useEffect(() => {
    [category, ...subcategories]
      .filter((c) => c.state === CategoryState.INIT)
      .forEach((category, i) =>
        dispatch(fetchCategory({ category, isSubcategory: i > 0 }))
      );
  }, []);

  return (
    <>
      <Box mb={files.length > 0 ? 8 : 0}>
        <FileGrid
          payload={{ type: "normal", files }}
          loading={state === CategoryState.LOADING}
        />
      </Box>
      {subcategories.map((s, i) => (
        <Box mb={8} key={i}>
          <Heading mb={4} id={s.id}>
            {s.name}
          </Heading>
          <FileGrid
            payload={{ type: "normal", files: s.files }}
            loading={s.state === CategoryState.LOADING}
          />
        </Box>
      ))}
    </>
  );
}
