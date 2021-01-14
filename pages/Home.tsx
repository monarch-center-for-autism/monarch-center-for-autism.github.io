import { Flex, Heading, Text, Image } from "@chakra-ui/react";
import React from "react";
import logo from "../public/logo.png";

export default function Home() {
  return (
    <Flex direction="column" alignItems="center" w="full" pt={16}>
      <Image src={logo} mb={8} />
      <Heading mb={4}>Welcome to the Monarch Resources website</Heading>
      <Text>
        Find curated content by visiting one of the pages in the side bar
      </Text>
    </Flex>
  );
}
