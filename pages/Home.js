import { Flex, Heading, Text, Image } from "@chakra-ui/react";
import React from "react";

export default function Home() {
  return (
    <Flex direction="column" alignItems="center" w="full" pt={16}>
      <Image
        src="gibbresh.png"
        fallbackSrc="https://via.placeholder.com/250"
        borderRadius="full"
        mb={8}
      />
      <Heading mb={4}>Welcome to Monarch Satellite</Heading>
      <Text>
        Find curated content by visiting one of the pages in the side bar
      </Text>
    </Flex>
  );
}
