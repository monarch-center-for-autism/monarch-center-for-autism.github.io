import { Flex, Text, Input, SimpleGrid } from "@chakra-ui/react";
import Fuse from "fuse.js";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import File from "../components/File";
import { actions, fetchCategory, useSelector } from "../store";

const fuse = new Fuse([], { keys: ["name"] });

export default function Search() {
  const [query, setQuery] = useState("");
  const categories = useSelector((state) => state.categories);
  const data = categories.flatMap((category) => category.files);
  const dispatch = useDispatch();

  const results = useMemo(() => {
    return fuse.search(query).map((x) => x.item);
  }, [data, query]);

  // TODO: This must change!!!
  // In the future, search what's already downloaded at a higher weight,
  // then search the google api
  useEffect(() => {
    categories
      .filter((c) => c.files.length === 0)
      .forEach((c) => dispatch(fetchCategory(c.id)));
  }, [categories.length]);

  useEffect(() => {
    fuse.setCollection(data);
  }, [data]);

  function handleQueryChange(e) {
    setQuery(e.target.value);
  }

  return (
    <Flex flex={1} direction="column" alignItems="center" p={8}>
      <Input
        size="lg"
        placeholder="Type to search"
        value={query}
        onChange={handleQueryChange}
      />
      {!query && (
        <Text color="gray.400" mt={16} size="lg">
          Please type in the text box to search the Monarch Drive
        </Text>
      )}
      <SimpleGrid w="full" mt={8} spacing={10} minChildWidth="250px">
        {[...(results ?? []), ...Array(5)].map((file, i) => {
          function onClick() {
            dispatch(actions.setActiveFile(file));
          }

          return <File file={file} key={i} onClick={onClick} />;
        })}
      </SimpleGrid>
    </Flex>
  );
}
