import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

export default function PageNotFound({ page }) {
  return (
    <Flex w="full" alignItems="center" direction="column" pt={16}>
      <Heading>Page {page} Not Found</Heading>
      <Text>Please use the sidebar to find a page</Text>
    </Flex>
  );
}
