import { Flex, Heading, Link, Text, VStack } from "@chakra-ui/react";
import Fuse from "fuse.js";
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "../store";

export default function PageNotFound({ page }) {
  const pages = useSelector((state) => state.pages);
  const fuse = new Fuse(pages ?? [], { keys: ["name"] });

  const similarPages = fuse.search(page, { limit: 3 }).map((x) => x.item);

  return (
    <Flex w="full" alignItems="center" direction="column" pt={16}>
      <Heading>Page "{page}" Not Found</Heading>
      <Text mt={2}>Please use the sidebar to find a page</Text>
      {similarPages.length > 0 && (
        <>
          <Text
            mt={16}
            color="gray.400"
            borderBottom="1px"
            borderColor="gray.400"
          >
            Did you mean one of these pages?
          </Text>
          <VStack mt={4}>
            {similarPages.map(({ id, name }) => (
              <Link as={NavLink} to={`/${id}`} color="gray.400">
                {name}
              </Link>
            ))}
          </VStack>
        </>
      )}
    </Flex>
  );
}
